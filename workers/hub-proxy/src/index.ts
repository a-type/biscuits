export default {
	async fetch(request): Promise<Response> {
		// proxy request to API origin
		const url = new URL(request.url);
		url.hostname = 'api.biscuits.club';
		return fetch(url);
	},
} satisfies ExportedHandler;
