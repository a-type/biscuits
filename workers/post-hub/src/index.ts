interface Environment {
	API_ORIGIN: string;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// rewrite the path to include /post/hub prefix
		const url = new URL(request.url);
		const originalHost = url.hostname;
		const apiHost = new URL(env.API_ORIGIN).hostname;
		url.hostname = apiHost;
		url.pathname = `/post/hub${url.pathname}`;
		return fetch(url, {
			headers: {
				...request.headers,
				'x-forwarded-host': originalHost,
			},
		});
	},
} satisfies ExportedHandler<Environment>;
