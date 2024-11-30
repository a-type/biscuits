import { AuthError, Session } from '@a-type/auth';
import { db } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { useCSRFPrevention } from '@graphql-yoga/plugin-csrf-prevention';
import { GraphQLError } from 'graphql';
import { Plugin, createYoga, maskError } from 'graphql-yoga';
import { Router } from 'itty-router';
import { sessions } from '../auth/session.js';
import { GQLContext } from '../graphql/context.js';
import { createDataloaders } from '../graphql/dataloaders/index.js';
import { schema } from '../graphql/schema.js';
import { stripe } from '../services/stripe.js';
import { verdantServer } from '../verdant/verdant.js';

function applyHeaders(): Plugin<{}, GQLContext> {
	return {
		onResponse: (payload) => {
			if (payload.serverContext) {
				payload.serverContext.auth.applyHeaders.forEach((value, key) => {
					payload.response.headers.append(key, value);
				});
			}
		},
	};
}

const yoga = createYoga<GQLContext>({
	schema,
	graphiql: true,
	maskedErrors: {
		maskError: (error, message, isDev) => {
			const originalError =
				'originalError' in (error as any) ?
					(error as any).originalError
				:	error;
			if (BiscuitsError.isInstance(originalError)) {
				// log more details for server errors
				if (originalError.statusCode >= 500) {
					console.error(`[Internal Error]`, error);
				} else {
					// no need to log these I think.
					// console.debug(`[Validation Error]`, originalError.message);
				}
				return new GraphQLError(originalError.message, {
					extensions: {
						unexpected: originalError.code === BiscuitsError.Code.Unexpected,
						biscuitsCode: originalError.code,
						...originalError.extraData,
					},
				});
			} else {
				console.error(`[GraphQL Error]`, error);
			}
			return maskError(error, message, isDev);
		},
	},
	plugins: [
		applyHeaders(),
		useCSRFPrevention({
			requestHeaders: ['x-csrf-token'],
		}),
	],
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
	const auth = {
		applyHeaders: new Headers(),
		setLoginSession: async (ses: Session | null) => {
			if (ses) {
				const { headers } = await sessions.updateSession(ses);
				auth.applyHeaders = new Headers(headers);
			} else {
				const { headers } = sessions.clearSession();
				auth.applyHeaders = new Headers(headers);
			}
			// also update immediately in the context, so that
			// resolvers on return values can see the new session
			ctx.session = ses;
		},
	};
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
		auth,
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
