import { Router } from 'itty-router';
import { Plugin, createYoga, maskError } from 'graphql-yoga';
import { db } from '@biscuits/db';
import { schema } from '../graphql/schema.js';
import { GQLContext } from '../graphql/context.js';
import { sessions } from '../auth/session.js';
import { Session } from '@a-type/auth';
import { verdantServer } from '../verdant/verdant.js';
import { BiscuitsError } from '@biscuits/error';
import { GraphQLError } from 'graphql';
import { stripe } from '../services/stripe.js';
import { AuthError } from '@a-type/auth';
import { createDataloaders } from '../graphql/dataloaders/index.js';

function applyHeaders(): Plugin<{}, GQLContext> {
  return {
    onResponse: (payload) => {
      if (payload.serverContext) {
        for (const [key, value] of Object.entries(
          payload.serverContext.auth.applyHeaders,
        )) {
          payload.response.headers.set(key, value);
        }
      }
    },
  };
}

const yoga = createYoga<GQLContext>({
  schema,
  graphiql: true,
  maskedErrors: {
    maskError: (error, message, isDev) => {
      console.error(`[GraphQL Error]`, error);
      const originalError =
        'originalError' in (error as any)
          ? (error as any).originalError
          : error;
      if (BiscuitsError.isInstance(originalError)) {
        return new GraphQLError(originalError.message, {
          extensions: {
            unexpected: originalError.code === BiscuitsError.Code.Unexpected,
            biscuitsCode: originalError.code,
          },
        });
      }
      return maskError(error, message, isDev);
    },
  },
  plugins: [applyHeaders()],
  fetchAPI: {
    Response: Response,
    Request: Request,
    Blob: Blob,
    ReadableStream: ReadableStream,
    fetch: fetch,
    Headers: Headers,
    FormData: FormData,
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder,
    TransformStream: TransformStream,
    URLSearchParams: URLSearchParams,
    WritableStream: WritableStream,
    URLPattern: URLPattern,
    URL: URL,
  },
});

export const graphqlRouter = Router({
  base: '/graphql',
});

graphqlRouter.all('/', handleGraphQLRequest);

async function handleGraphQLRequest(request: Request) {
  let sessionHeaders: Record<string, string> = {};
  let session = null;
  try {
    session = await sessions.getSession(request);
  } catch (e) {
    // if session expired, we need to tell the client to refresh it
    if (e instanceof AuthError) {
      if (e.message === 'Session expired') {
        throw new BiscuitsError(
          BiscuitsError.Code.SessionExpired,
          'Session expired',
        );
      }
    }
    throw e;
  }

  const ctx: GQLContext = {
    req: request,
    session,
    db,
    auth: {
      applyHeaders: sessionHeaders,
      setLoginSession: async (ses: Session | null) => {
        if (ses) {
          const { headers } = await sessions.updateSession(ses);
          Object.assign(sessionHeaders, headers);
        } else {
          const { headers } = sessions.clearSession();
          Object.assign(sessionHeaders, headers);
        }
        // also update immediately in the context, so that
        // resolvers on return values can see the new session
        ctx.session = ses;
      },
    },
    verdant: verdantServer,
    stripe,
    dataloaders: createDataloaders({
      stripe,
      db,
    }),
  };

  const yogaResponse = await yoga.handle(request, ctx);
  return yogaResponse;
}
