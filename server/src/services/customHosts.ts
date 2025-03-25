import { DomainRoute } from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID } from '../config/secrets.js';

export class CustomHostsService {
	private fetch = async (path: string, init?: RequestInit): Promise<any> => {
		const res = await fetch(
			`https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}${path}`,
			{
				...init,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
					...init?.headers,
				},
			},
		);
		if (!res.ok) {
			console.error(await res.text());
			throw new BiscuitsError(
				BiscuitsError.Code.Unexpected,
				`Cloudflare API request failed: ${res.status} ${res.statusText}`,
			);
		}
		return res.json();
	};
	async create(domainRoute: DomainRoute) {
		return this.fetch('/custom_hostnames', {
			method: 'POST',
			body: JSON.stringify({
				hostname: domainRoute.domain,
				ssl: {
					type: 'dv',
					method: 'http',
				},
				// you have to pay for this...
				// custom_metadata: {
				// 	appId: domainRoute.appId,
				// 	resourceId: domainRoute.resourceId,
				// 	planId: domainRoute.planId,
				// 	createdAt: domainRoute.createdAt,
				// },
			}),
		});
	}
	async get(hostname: string) {
		const res = await this.fetch(`/custom_hostnames?hostname=${hostname}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (res.errors?.length) {
			throw new BiscuitsError(
				BiscuitsError.Code.Unexpected,
				`Cloudflare API request failed: ${res.errors}`,
			);
		}
		console.log(res.result[0]);
		return res.result[0] as {
			id: string;
			ssl: {
				id: string;
				// others...
				expires_on: string;
				status:
					| 'initializing'
					| 'pending_validation'
					| 'deleted'
					| 'pending_issuance'
					| 'pending_deployment'
					| 'pending_expiration'
					| 'expired'
					| 'active'
					| 'initializing_timed_out'
					| 'validation_timed_out'
					| 'issuance_timed_out'
					| 'deployment_timed_out'
					| 'deletion_timed_out'
					| 'pending_cleanup'
					| 'staging_deployment'
					| 'staging_active'
					| 'deactivating'
					| 'inactive'
					| 'backup_issued'
					| 'holding_deployment';
			};
			custom_metadata: {
				appId: string;
				resourceId: string;
				planId: string;
				createdAt: Date;
			};
			ownership_verification: {
				name: string;
				type: string;
				value: string;
			};
			status:
				| 'active'
				| 'pending'
				| 'active_redeploying'
				| 'moved'
				| 'pending_deletion'
				| 'deleted'
				| 'pending_blocked'
				| 'pending_migration'
				| 'pending_provisioned'
				| 'test_pending'
				| 'test_active'
				| 'test_active_apex'
				| 'test_blocked'
				| 'test_failed'
				| 'provisioned'
				| 'blocked';
		};
	}

	async remove(hostname: string) {
		const data = await this.get(hostname);
		if (!data) {
			throw new BiscuitsError(
				BiscuitsError.Code.NotFound,
				`Custom hostname ${hostname} not found`,
			);
		}
		return this.fetch(`/custom_hostnames/${data.id}`, {
			method: 'DELETE',
		});
	}
}

export const customHosts = new CustomHostsService();
