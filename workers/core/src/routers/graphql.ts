import { AuthError, Session } from '@a-type/auth';
import { BiscuitsError } from '@biscuits/error';
import { useCSRFPrevention as withCsrf } from '@graphql-yoga/plugin-csrf-prevention';
import { GraphQLError } from 'graphql';
import { Plugin, createYoga, maskError } from 'graphql-yoga';
import { Hono } from 'hono';
import { ZodError } from 'zod';
import { sessions } from '../auth/session.js';
import { HonoEnv } from '../config/hono.js';
import { GQLContext } from '../graphql/context.js';
import { createDataloaders } from '../graphql/dataloaders/index.js';
import { schema } from '../graphql/schema.js';
import { CustomHostsService } from '../services/customHosts.js';
import { createDb } from '../services/db/index.js';
import { DomainRouteService } from '../services/domainRouteCache.js';
import { Maps } from '../services/maps.js';
import { getStripe } from '../services/stripe.js';
import { Weather } from '../services/weather.js';

function applyHeaders(): Plugin<any, GQLContext> {
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
						zodErrors: originalError.issues.map((e) => ({
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
		withCsrf({
			requestHeaders: ['x-csrf-token'],
		}),
	],
	// fetchAPI: {
	// 	Response: Response,
	// 	Request: Request,
	// 	Blob: Blob,
	// 	ReadableStream: ReadableStream,
	// 	fetch: fetch,
	// 	Headers: Headers,
	// 	FormData: FormData,
	// 	TextDecoder: TextDecoder,
	// 	TextEncoder: TextEncoder,
	// 	TransformStream: TransformStream,
	// 	URLSearchParams: URLSearchParams,
	// 	WritableStream: WritableStream,
	// 	URL: URL,
	// },
});

export const graphqlRouter = new Hono<HonoEnv>().all(
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
				if (e.message === AuthError.Messages.SessionExpired) {
					throw new BiscuitsError(
						BiscuitsError.Code.SessionExpired,
						'Session expired',
					);
				} else if (e.message === AuthError.Messages.InvalidSession) {
					throw new BiscuitsError(
						BiscuitsError.Code.SessionInvalid,
						'Session invalid',
					);
				}
			}
			throw e;
		}

		const db = createDb(honoCtx.env.CORE_DB);
		const stripe = getStripe(honoCtx.env.STRIPE_SECRET_KEY);

		const maps = new Maps(honoCtx.env.GOOGLE_MAPS_API_KEY);
		const weather = new Weather(honoCtx.env.OPENWEATHER_API_KEY);
		const customHosts = new CustomHostsService(
			honoCtx.env.CLOUDFLARE_APP_API_TOKEN,
			honoCtx.env.CLOUDFLARE_ZONE_ID,
		);
		const domainRoutes = new DomainRouteService(db, honoCtx.env.DOMAIN_ROUTES);

		const ctx: GQLContext = {
			req: honoCtx.req.raw,
			session,
			db,
			auth,
			stripe,
			dataloaders: createDataloaders({
				stripe,
				db,
				customHosts,
			}),
			reqCtx: honoCtx,
			customHosts,
			domainRoutes,
			maps,
			weather,
		};

		const yogaResponse = await yoga.handle(honoCtx.req.raw, ctx);
		return yogaResponse;
	},
);
