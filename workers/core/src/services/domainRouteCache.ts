import { DB, DomainRoute, NewDomainRoute } from '@biscuits/db';

export class DomainRouteService {
	constructor(
		private db: DB,
		private kv: KVNamespace,
	) {}

	#put = (domain: string, route: DomainRoute) => {
		this.kv.put(domain, JSON.stringify(route));
	};
	#get = async (domain: string) => {
		const val = await this.kv.get(domain);
		if (!val) return null;
		return JSON.parse(val) as DomainRoute;
	};
	#delete = (domain: string) => {
		this.kv.delete(domain);
	};

	async preload() {
		const routes = await this.db
			.selectFrom('DomainRoute')
			.selectAll()
			.execute();

		for (const route of routes) {
			this.#put(route.domain, route);
		}
	}

	async add(init: NewDomainRoute) {
		const route = await this.db
			.insertInto('DomainRoute')
			.values(init)
			.returningAll()
			.executeTakeFirstOrThrow();
		this.#put(route.domain, route);
		return route;
	}

	async deleteById(id: string) {
		const route = await this.db
			.deleteFrom('DomainRoute')
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirst();
		if (route) {
			this.#delete(route.domain);
		}
		return route;
	}

	get(domain: string) {
		return this.#get(domain);
	}

	async getById(id: string) {
		const route = await this.db
			.selectFrom('DomainRoute')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
		if (route) {
			this.#put(route.domain, route);
		}
		return route;
	}

	has(domain: string) {
		return !!this.#get(domain);
	}

	async debug() {
		console.log(
			'Domain routes registered:',
			(await this.kv.list()).keys.map((k) => k.name),
		);
	}
}

// export const domainRoutes = new DomainRouteService();
// domainRoutes.preload().then(() => {
// 	logger.info('DomainRouteCache preloaded', domainRoutes.size, 'routes');
// });
