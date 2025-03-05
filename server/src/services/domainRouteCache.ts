import { db, DomainRoute } from '@biscuits/db';

export class DomainRouteCache {
	#cache: Map<string, DomainRoute> = new Map();

	async get(domain: string) {
		if (this.#cache.has(domain)) {
			return this.#cache.get(domain)!;
		}

		const route = await db
			.selectFrom('DomainRoute')
			.selectAll()
			.where('domain', '=', domain)
			.executeTakeFirst();

		if (!route) {
			return null;
		}

		this.#cache.set(domain, route);
		return route;
	}
}

export const domainRouteCache = new DomainRouteCache();
