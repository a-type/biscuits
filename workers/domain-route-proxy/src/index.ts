import { appsById, isValidAppId } from '@biscuits/apps';
import { DomainRouteService } from '@biscuits/domain-routes';
import { env } from 'cloudflare:workers';
import { parse, serialize } from 'cookie';

const domainRoutes = new DomainRouteService(env.DB, env.DOMAIN_ROUTES);

/**
 * Proxies requests to the API. Based on the incoming hostname, the API
 * will decide what to serve, so we need to forward the hostname to the API.
 *
 * Someday, this worker will orchestrate edge workers that produce
 * the pages themselves, but right now the functionality is still in
 * the main server.
 */
export default {
	async fetch(request, env): Promise<Response> {
		try {
			console.log('Domain route proxy received request', request.url);
			const requestUrl = new URL(request.url);
			let incomingHost;
			if (env.TLD === 'localhost') {
				// allow mocking hosts on localhost
				incomingHost = requestUrl.searchParams.get('mockHost');
				if (!incomingHost) {
					// also check cookies, for asset requests
					const cookies = parse(request.headers.get('cookie') || '');
					incomingHost = cookies.mockHost;
				}
			} else {
				incomingHost = request.headers.get('host');
			}
			if (!incomingHost) {
				console.error('No host header', request.url);
				return new Response('No host header', {
					status: 400,
				});
			}

			const route = await domainRoutes.get(incomingHost);
			if (!route) {
				console.warn('No route configured for host', incomingHost);
				return new Response('No route configured for host', {
					status: 404,
				});
			}

			if (!isValidAppId(route.appId)) {
				console.error('Invalid app ID for route', route);
				return new Response('Invalid app ID for route', {
					status: 500,
				});
			}

			const app = appsById[route.appId];

			if (!app.domainRoutes) {
				console.error('App does not support domain routes', app);
				return new Response('App does not support domain routes', {
					status: 500,
				});
			}

			const routeUrlRaw = app.domainRoutes(route.resourceId, {
				tld: env.TLD,
			});
			const routeUrl = new URL(routeUrlRaw);
			routeUrl.pathname = requestUrl.pathname;

			if (routeUrl.pathname.startsWith('/@')) {
				routeUrl.search = '';
			}

			console.info(`Proxying request ${request.url} to ${routeUrl}`);

			const headers: HeadersInit = {
				'x-forwarded-host': incomingHost,
				'x-forwarded-for': request.headers.get('x-real-ip') || '',
				origin: request.headers.get('origin') || '',
			};

			const res = await fetch(routeUrl, {
				headers,
			});

			// assign a cookie to lookup later. this enables the asset requests
			// in localhost, since the initial ?mockHost param won't be present
			// on subsequent requests.
			const responseHeaders = new Headers(res.headers);
			responseHeaders.set('x-proxied-by', 'domain-route-proxy');
			if (env.TLD === 'localhost') {
				responseHeaders.append(
					'set-cookie',
					serialize('mockHost', incomingHost, { httpOnly: true, path: '/' }),
				);
			}

			return new Response(res.body, {
				status: res.status,
				statusText: res.statusText,
				headers: responseHeaders,
			});
		} catch (e) {
			console.error(e);
			return new Response('Failed to proxy request', {
				status: 500,
			});
		}
	},
} satisfies ExportedHandler<Env>;
