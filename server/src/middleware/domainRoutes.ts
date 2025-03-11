import { appsById, isValidAppId } from '@biscuits/apps';
import { BiscuitsError } from '@biscuits/error';
import { createMiddleware } from 'hono/factory';
import { proxy } from 'hono/proxy';
import { URL } from 'node:url';
import { ALLOWED_HEADERS, EXPOSED_HEADERS } from '../config/cors.js';
import { DEPLOYED_ORIGIN, PORT } from '../config/deployedContext.js';
import { Env } from '../config/hono.js';
import { logger } from '../logger.js';
import { domainRouteCache } from '../services/domainRouteCache.js';

const deployedDomain = new URL(DEPLOYED_ORIGIN).hostname;

export const domainRoutesMiddleware = createMiddleware<Env>(
	async (ctx, next) => {
		const requestHost = ctx.req.header('host');
		if (!requestHost || requestHost === deployedDomain) {
			return await next();
		} else {
			logger.debug(`Custom domain route: ${requestHost}`);
			ctx.set('customDomain', requestHost);
			const route = await domainRouteCache.get(requestHost);
			if (!route) {
				await next();
				return;
			}

			if (!isValidAppId(route.appId)) {
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					`Invalid custom domain route app: ${route.appId}`,
				);
			}
			const app = appsById[route.appId];
			if (!app.domainRoutes) {
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					'App does not support custom domain routes',
				);
			}
			const routePath = app.domainRoutes(route.resourceId);
			const routedUrl = new URL(routePath, `http://localhost:${PORT}`);
			const res = await proxy(routedUrl, ctx.req);
			res.headers.set('X-Route-Id', route.id);
			res.headers.set(
				'Access-Control-Expose-Headers',
				EXPOSED_HEADERS.join(', '),
			);
			res.headers.set('Access-Control-Allow-Origin', `https://${requestHost}`);
			res.headers.set('Access-Control-Allow-Credentials', 'true');
			res.headers.set(
				'Access-Control-Allow-Methods',
				'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			);
			res.headers.set(
				'Access-Control-Allow-Headers',
				ALLOWED_HEADERS.join(', '),
			);
			ctx.res = res;
		}
	},
);
