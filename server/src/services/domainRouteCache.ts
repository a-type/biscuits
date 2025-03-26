import { db, DomainRoute, NewDomainRoute } from '@biscuits/db';
import { logger } from '../logger.js';

export class DomainRouteService {
	#cache: Map<string, DomainRoute> = new Map();

	async preload() {
		const routes = await db.selectFrom('DomainRoute').selectAll().execute();

		for (const route of routes) {
			this.#cache.set(route.domain, route);
		}
	}

	async add(init: NewDomainRoute) {
		const route = await db
			.insertInto('DomainRoute')
			.values(init)
			.returningAll()
			.executeTakeFirstOrThrow();
		this.#cache.set(route.domain, route);
		return route;
	}

	async deleteById(id: string) {
		const route = await db
			.deleteFrom('DomainRoute')
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirst();
		if (route) {
			this.#cache.delete(route.domain);
		}
		return route;
	}

	get(domain: string) {
		return this.#cache.get(domain);
	}

	async getById(id: string) {
		for (const route of this.#cache.values()) {
			if (route.id === id) {
				return route;
			}
		}

		const route = await db
			.selectFrom('DomainRoute')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
		if (route) {
			this.#cache.set(route.domain, route);
		}
		return route;
	}

	has(domain: string) {
		return this.#cache.has(domain);
	}

	get size() {
		return this.#cache.size;
	}
}

export const domainRoutes = new DomainRouteService();
domainRoutes.preload().then(() => {
	logger.info('DomainRouteCache preloaded', domainRoutes.size, 'routes');
});
