import { AuthError, Session } from '@a-type/auth';
import { db } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { useCSRFPrevention } from '@graphql-yoga/plugin-csrf-prevention';
import { GraphQLError } from 'graphql';
import { Plugin, createYoga, maskError } from 'graphql-yoga';
import { Hono } from 'hono';
import {
	ReadableStream,
	TransformStream,
	WritableStream,
} from 'node:stream/web';
import { ZodError } from 'zod';
import { sessions } from '../auth/session.js';
import { Env } from '../config/hono.js';
import { GQLContext } from '../graphql/context.js';
import { createDataloaders } from '../graphql/dataloaders/index.js';
import { schema } from '../graphql/schema.js';
import { stripe } from '../services/stripe.js';
import { verdantServer } from '../verdant/verdant.js';

function applyHeaders(): Plugin<{}, GQLContext> {
	return {
		onResponse: (payload: any) => {
			if (payload.serverContext) {
				payload.serverContext.auth.applyHeaders.forEach(
					(value: string, key: string) => {
						payload.response.headers.append(key, value);
					},
				);
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
			} else if (originalError instanceof ZodError) {
				console.error(`[Zod Error]`, error);
				return new GraphQLError(originalError.message, {
					extensions: {
						zodErrors: originalError.errors.map((e) => ({
							message: e.message,
						})),
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
		URL: URL,
	},
});

export const graphqlRouter = new Hono<Env>().all(
	'/',
	async function handleGraphQLRequest(honoCtx) {
		const auth = {
			applyHeaders: new Headers(),
			setLoginSession: async (ses: Session | null) => {
				if (ses) {
					const { headers } = await sessions.updateSession(ses, honoCtx);
					auth.applyHeaders = new Headers(headers);
				} else {
					const { headers } = sessions.clearSession(honoCtx);
					auth.applyHeaders = new Headers(headers);
				}
				// also update immediately in the context, so that
				// resolvers on return values can see the new session
				ctx.session = ses;
			},
		};
		let session = null;
		try {
			session = await sessions.getSession(honoCtx);
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
			req: honoCtx.req.raw,
			session,
			db,
			auth,
			verdant: verdantServer,
			stripe,
			dataloaders: createDataloaders({
				stripe,
				db,
			}),
			reqCtx: honoCtx,
		};

		const yogaResponse = await yoga.handle(honoCtx.req.raw, ctx);
		return yogaResponse;
	},
);
