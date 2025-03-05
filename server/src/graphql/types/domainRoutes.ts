import { assert } from '@a-type/utils';
import { appsById, isValidAppId } from '@biscuits/apps';
import { id } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
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
			}),
		},
		authScopes: {
			member: true,
		},
		resolve: async (parent, { byApp, validate }, context) => {
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

			// if validate was requested, do so now.
			if (validate) {
				const certResult = await context.fly.validateCertificate(
					domainRoute.domain,
				);
				if (certResult.clientStatus === 'Ready' && !domainRoute.dnsVerifiedAt) {
					// also check the main route
					const matches = await doesHostnameRouteToCustomDnsHost(
						domainRoute.domain,
					);
					if (matches) {
						await context.db
							.updateTable('DomainRoute')
							.set({ dnsVerifiedAt: new Date() })
							.where('id', '=', domainRoute.id)
							.execute();
					}
				}
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

			const domainRoute = await context.db
				.insertInto('DomainRoute')
				.values({
					id: id(),
					planId: context.session.planId,
					...input,
				})
				.returningAll()
				.executeTakeFirstOrThrow();

			// provision TLS certificate
			await context.fly.provisionCertificate(domainRoute.domain);

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
			const domainRoute = await context.db
				.selectFrom('DomainRoute')
				.selectAll()
				.where('id', '=', id)
				.executeTakeFirstOrThrow();

			await context.fly.provisionCertificate(domainRoute.domain);

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
			const route = await context.db
				.deleteFrom('DomainRoute')
				.where('id', '=', id)
				.returningAll()
				.executeTakeFirst();

			if (route) {
				await context.fly.deprovisionCertificate(route.domain);
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
				if (parent.dnsVerifiedAt) {
					return 'READY';
				}

				const cert = await ctx.dataloaders.flyCertificateLoader.load(
					parent.domain,
				);
				if (BiscuitsError.isInstance(cert)) {
					throw cert;
				}
				if (!cert) {
					return 'UNPROVISIONED';
				}
				if (cert.clientStatus === 'Error') {
					return 'ERROR';
				}
				if (
					cert.clientStatus === 'Awaiting configuration' ||
					cert.clientStatus !== 'Ready'
				) {
					return 'TLS_SETUP';
				}
				return 'MAIN_RECORD_SETUP';
			},
		}),
		note: t.string({
			nullable: true,
			resolve: async (parent, _, ctx) => {
				if (parent.dnsVerifiedAt) {
					return null;
				}

				const cert = await ctx.dataloaders.flyCertificateLoader.load(
					parent.domain,
				);
				if (BiscuitsError.isInstance(cert)) {
					throw cert;
				}
				if (!cert) {
					return 'No provisioning in progress. You may need to delete and start over.';
				}

				if (cert.clientStatus === 'Error') {
					return 'An unexpected error occurred. You may need to delete and start over.';
				}

				if (cert.clientStatus === 'Awaiting certificates') {
					return 'Generating your TLS certificates...';
				}

				if (cert.clientStatus === 'Ready') {
					const matches = await doesHostnameRouteToCustomDnsHost(parent.domain);

					if (!matches) {
						return 'Main record not set up correctly. Please check your DNS settings.';
					}
				}

				return null;
			},
		}),
		tlsRecord: t.field({
			type: 'DnsRecord',
			nullable: true,
			resolve: async (parent, _, ctx) => {
				const cert = await ctx.dataloaders.flyCertificateLoader.load(
					parent.domain,
				);
				if (BiscuitsError.isInstance(cert)) {
					throw cert;
				}
				if (!cert) {
					return null;
				}

				return {
					name: cert.dnsValidationHostname,
					type: getRecordTypeFromInstructions(cert.dnsValidationInstructions),
					value: cert.dnsValidationTarget,
				};
			},
		}),
		mainRecord: t.field({
			type: 'DnsRecord',
			resolve: async (parent, _, ctx) => {
				// TODO: make this real
				return {
					value: 'custom-dns.biscuits.club',
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

const checkInstructionsForTypes = ['TXT', 'CNAME', 'A'];
function getRecordTypeFromInstructions(instructions: string) {
	return (
		checkInstructionsForTypes.find((type) => instructions.includes(type)) ||
		'CNAME'
	);
}
