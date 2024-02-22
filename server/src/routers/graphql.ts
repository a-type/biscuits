import { Router } from 'itty-router';
import { createYoga, maskError } from 'graphql-yoga';
import { db } from '@biscuits/db';
import { schema } from '../graphql/schema.js';
import { GQLContext } from '../graphql/context.js';
import { sessions } from '../auth/session.js';
import { Session } from '@a-type/auth';
import { verdantServer } from '../verdant/verdant.js';
import { BiscuitsError } from '../error.js';
import { GraphQLError } from 'graphql';

const yoga = createYoga<GQLContext>({
  schema,
  maskedErrors: {
    maskError: (error, message, isDev) => {
      if (error instanceof BiscuitsError) {
        return new GraphQLError(`[Code: ${error.code}] ${error.message}`);
      }
      return maskError(error, message, isDev);
    },
  },
});

export const graphqlRouter = Router({
  base: '/graphql',
});

graphqlRouter.all('/', handleGraphQLRequest);

async function handleGraphQLRequest(request: Request) {
  let sessionHeaders: Record<string, string> = {};
  const auth = {
    setLoginSession: async (ses: Session | null) => {
      if (ses) {
        sessionHeaders = await sessions.updateSession(ses);
      } else {
        sessionHeaders = sessions.clearSession();
      }
    },
  };

  const ctx: GQLContext = {
    req: request,
    session: await sessions.getSession(request),
    db,
    auth,
    verdant: verdantServer,
  };
  const response = await yoga.fetch(request, ctx);
  // merge session headers with response headers
  return new Response(response.body, {
    status: response.status,
    headers: {
      ...response.headers,
      ...sessionHeaders,
    },
  });
}
