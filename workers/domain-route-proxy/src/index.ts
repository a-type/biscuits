interface Environment {
	API_ORIGIN: string;
}

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
			const incomingHost = request.headers.get('host');
			if (!incomingHost) {
				console.error('No host header', request.url);
				return new Response('No host header', {
					status: 400,
				});
			}

			const apiHost = new URL(env.API_ORIGIN).hostname;
			// proxy request to API origin
			const url = new URL(request.url);
			url.hostname = apiHost;

			console.info(`Proxying request ${request.url} to ${url.toString()}`);

			const headers: HeadersInit = {
				'x-forwarded-host': incomingHost,
				'x-forwarded-for': request.headers.get('x-real-ip') || '',
				origin: request.headers.get('origin') || '',
			};

			return await fetch(url, {
				headers,
			});
		} catch (e) {
			console.error(e);
			return new Response('Failed to proxy request', {
				status: 500,
			});
		}
	},
} satisfies ExportedHandler<Environment>;
