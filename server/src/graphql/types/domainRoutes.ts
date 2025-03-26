import { assert } from '@a-type/utils';
import { appsById, isValidAppId } from '@biscuits/apps';
import { id } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { logger } from '../../logger.js';
import { doesHostnameRouteToCustomDnsHost } from '../../services/dns.js';
import { builder } from '../builder.js';
import { assignTypeName } from '../relay.js';

builder.queryFields((b) => ({
	domainRoute: b.field({
		type: 'DomainRoute',
		nullable: true,
		args: {
			byApp: b.arg({
				type: 'GetDomainRouteByAppInput',
				required: false,
			}),
			validate: b.arg.boolean({
				required: false,
				deprecationReason: 'No longer used, validation happens automatically',
			}),
		},
		authScopes: {
			member: true,
		},
		resolve: async (parent, { byApp }, context) => {
			if (!byApp) {
				throw new BiscuitsError(BiscuitsError.Code.BadRequest, 'Invalid input');
			}

			const domainRoute = await context.db
				.selectFrom('DomainRoute')
				.selectAll()
				.where('appId', '=', byApp.appId)
				.where('resourceId', '=', byApp.resourceId)
				.executeTakeFirst();

			if (!domainRoute) {
				return null;
			}

			return assignTypeName('DomainRoute')(domainRoute);
		},
	}),
}));

builder.mutationFields((b) => ({
	createDomainRoute: b.field({
		type: 'CreateDomainRouteResult',
		args: {
			input: b.arg({
				type: 'CreateDomainRouteInput',
				required: true,
			}),
		},
		authScopes: {
			planAdmin: true,
		},
		resolve: async (parent, { input }, context) => {
			// get route from input
			if (!isValidAppId(input.appId)) {
				throw new BiscuitsError(BiscuitsError.Code.BadRequest, 'Invalid app');
			}
			const app = appsById[input.appId];
			if (!app.domainRoutes) {
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					'App does not support custom domain routes',
				);
			}

			assert(context.session?.planId);

			const domainRoute = await context.domainRoutes.add({
				id: id(),
				planId: context.session.planId,
				...input,
			});

			// provision TLS certificate
			await context.customHosts.create(domainRoute);

			return {
				domainRoute: assignTypeName('DomainRoute')(domainRoute),
			};
		},
	}),
	reprovisionDomainRoute: b.field({
		type: 'DomainRoute',
		description:
			'Reprovision the TLS certificate for a domain route if it was lost somehow',
		args: {
			id: b.arg({
				type: 'ID',
				required: true,
			}),
		},
		authScopes: {
			planAdmin: true,
		},
		resolve: async (parent, { id }, context) => {
			const domainRoute = await context.domainRoutes.getById(id);
			if (!domainRoute) {
				throw new BiscuitsError(
					BiscuitsError.Code.NotFound,
					'Domain route not found',
				);
			}
			await context.customHosts.create(domainRoute);

			return assignTypeName('DomainRoute')(domainRoute);
		},
	}),
	deleteDomainRoute: b.field({
		type: 'String',
		args: {
			id: b.arg({
				type: 'ID',
				required: true,
			}),
		},
		authScopes: {
			planAdmin: true,
		},
		resolve: async (_, { id }, context) => {
			const route = await context.domainRoutes.deleteById(id);

			if (route) {
				try {
					await context.customHosts.remove(route.domain);
				} catch (error) {
					if (
						error instanceof BiscuitsError &&
						error.code === BiscuitsError.Code.NotFound
					) {
						// that's fine.
						return id;
					} else {
						logger.urgent(error);
					}
				}
			}

			return id;
		},
	}),
}));

builder.objectType('DomainRoute', {
	fields: (t) => ({
		id: t.exposeID('id'),
		createdAt: t.expose('createdAt', {
			type: 'DateTime',
		}),
		updatedAt: t.expose('updatedAt', {
			type: 'DateTime',
			nullable: true,
		}),
		domain: t.exposeString('domain'),
		route: t.string({
			resolve: (parent) => {
				assert(isValidAppId(parent.appId));
				const app = appsById[parent.appId];
				if (!app.domainRoutes) {
					throw new BiscuitsError(
						BiscuitsError.Code.Unexpected,
						'App does not support custom domain routes',
					);
				}
				return app.domainRoutes(parent.resourceId);
			},
		}),
		appId: t.exposeString('appId'),
		resourceId: t.exposeString('resourceId'),
		status: t.field({
			type: DomainRouteStatus,
			resolve: async (parent, _, ctx) => {
				const details = await ctx.dataloaders.customHostDetailsLoader.load(
					parent.domain,
				);
				if (BiscuitsError.isInstance(details)) {
					throw details;
				}
				if (!details) {
					return 'UNPROVISIONED';
				}

				// I think this is represented in details for us.
				// const matches = await doesHostnameRouteToCustomDnsHost(parent.domain);

				// if (!matches) {
				// 	return 'MAIN_RECORD_SETUP';
				// }

				if (
					details.status === 'blocked' ||
					details.status === 'test_failed' ||
					details.ssl?.status.includes('timed_out')
				) {
					return 'ERROR';
				}

				if (details.status !== 'active') {
					return 'MAIN_RECORD_SETUP';
				}

				if (details.status === 'active' && details.ssl?.status !== 'active') {
					return 'TLS_SETUP';
				}

				if (
					details.status === 'active' &&
					details.ssl?.status === 'active' &&
					!parent.dnsVerifiedAt
				) {
					// oh, we're good.
					await ctx.db
						.updateTable('DomainRoute')
						.set({ dnsVerifiedAt: new Date() })
						.where('id', '=', parent.id)
						.execute();
					return 'READY';
				}

				return 'READY';
			},
		}),
		note: t.string({
			nullable: true,
			resolve: async (parent, _, ctx) => {
				if (parent.dnsVerifiedAt) {
					return null;
				}

				const matches = await doesHostnameRouteToCustomDnsHost(parent.domain);

				if (!matches) {
					return "Main DNS record hasn't connected yet. Please double-check your DNS settings.";
				}

				const details = await ctx.dataloaders.customHostDetailsLoader.load(
					parent.domain,
				);
				if (BiscuitsError.isInstance(details)) {
					throw details;
				}
				if (!details) {
					return 'No provisioning in progress. You may need to delete and start over.';
				}

				if (details.status === 'blocked' || details.status === 'test_failed') {
					return 'An unexpected error occurred. You may need to delete and start over.';
				}

				if (
					details?.ssl &&
					(details.ssl.status === 'initializing' ||
						details.ssl.status.includes('pending'))
				) {
					return 'Generating your TLS certificates...';
				}

				return null;
			},
		}),
		verificationRecord: t.field({
			type: 'DnsRecord',
			nullable: true,
			resolve: async (parent, _, ctx) => {
				const details = await ctx.dataloaders.customHostDetailsLoader.load(
					parent.domain,
				);
				if (BiscuitsError.isInstance(details)) {
					throw details;
				}
				if (!details) {
					return null;
				}
				if (!details.ownership_verification) {
					return null;
				}

				return details.ownership_verification;
			},
		}),
		mainRecord: t.field({
			type: 'DnsRecord',
			resolve: async (parent, _, ctx) => {
				return {
					value: 'my.biscuits.page',
					type: 'CNAME',
					name: parent.domain,
				};
			},
		}),
	}),
});

builder.objectType('CreateDomainRouteResult', {
	fields: (t) => ({
		domainRoute: t.expose('domainRoute', {
			type: 'DomainRoute',
		}),
	}),
});

builder.inputType('GetDomainRouteByAppInput', {
	fields: (t) => ({
		appId: t.string({
			required: true,
		}),
		resourceId: t.string({
			required: true,
		}),
	}),
});

builder.inputType('CreateDomainRouteInput', {
	fields: (t) => ({
		appId: t.string({
			required: true,
		}),
		resourceId: t.string({
			required: true,
		}),
		domain: t.string({
			required: true,
		}),
	}),
});

builder.objectType('DnsRecord', {
	fields: (t) => ({
		name: t.exposeString('name'),
		type: t.exposeString('type'),
		value: t.exposeString('value'),
	}),
});

const DomainRouteStatus = builder.enumType('DomainRouteStatus', {
	values: ['UNPROVISIONED', 'TLS_SETUP', 'MAIN_RECORD_SETUP', 'READY', 'ERROR'],
});
