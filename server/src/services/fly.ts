import { BiscuitsError } from '@biscuits/error';
import { logger } from '../logger.js';

if (!process.env.FLY_API_TOKEN) {
	throw new Error('FLY_API_TOKEN is required');
}

export interface FlyCertificateDetail {
	id: string;
	createdAt: string;
	hostname: string;
	clientStatus: string;
	configured: boolean;
	source: string;
	dnsValidationInstructions: string;
	dnsValidationHostname: string;
	dnsValidationTarget: string;
	dnsProvider: string;
	certificateAuthority: string;
}

export class FlyService {
	#token = process.env.FLY_API_TOKEN;
	#appName = process.env.FLY_APP_NAME || 'biscuits-club';

	#fetch = async (query: string, variables: any) => {
		try {
			const response = await fetch(`https://api.fly.io/graphql`, {
				method: 'POST',
				body: JSON.stringify({ query, variables }),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.#token}`,
				},
			});

			if (!response.ok) {
				logger.urgent(
					`Fly API request failed: ${response.statusText}`,
					await response.text(),
				);
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					`Fly API request failed: ${response.statusText}`,
				);
			}

			const { data, errors } = await response.json();
			if (errors && !data) {
				logger.urgent(`Fly API request failed: ${errors[0].message}`, errors);
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					`Fly API request failed: ${errors[0].message}`,
				);
			}

			return data;
		} catch (err) {
			logger.urgent(`Fly API request failed: ${err}`);
			throw new BiscuitsError(
				BiscuitsError.Code.Unexpected,
				`Fly API request failed: ${err instanceof Error ? err.message : ''}`,
				err,
			);
		}
	};

	async listCertificates() {
		const data = await this.#fetch(
			`
			query ProvisionedCertificates($appName: String!) {
				app(name: $appName) {
					certificates {
						nodes {
							id
							createdAt
							hostname
							clientStatus
						}
					}
				}
			}
		`,
			{
				appName: this.#appName,
			},
		);

		return data.app.certificates.nodes as {
			id: string;
			createdAt: string;
			hostname: string;
			clientStatus: string;
		}[];
	}

	async getCertificate(hostname: string) {
		const data = await this.#fetch(
			`
			query Certificate($appName: String!, $hostname: String!) {
				app(name: $appName) {
					certificate(hostname: $hostname) {
						id
						createdAt
						hostname
						clientStatus
						configured
						source
						dnsValidationInstructions
						dnsValidationHostname
						dnsValidationTarget
						dnsProvider
						certificateAuthority
					}
				}
			}
		`,
			{
				appName: this.#appName,
				hostname,
			},
		);

		return data.app.certificate as FlyCertificateDetail;
	}

	async provisionCertificate(hostname: string) {
		const data = await this.#fetch(
			`
			mutation ProvisionCertificate($appName: ID!, $hostname: String!) {
				addCertificate(appId: $appName, hostname: $hostname) {
					certificate {
						id
						createdAt
						hostname
						clientStatus
						configured
						source
						dnsValidationInstructions
						dnsValidationHostname
						dnsValidationTarget
						dnsProvider
						certificateAuthority
					}
				}
			}
		`,
			{
				appName: this.#appName,
				hostname,
			},
		);

		return data.addCertificate.certificate as {
			id: string;
			createdAt: string;
			hostname: string;
			clientStatus: string;
			configured: boolean;
			source: string;
			dnsValidationInstructions: string;
			dnsValidationHostname: string;
			dnsValidationTarget: string;
			dnsProvider: string;
			certificateAuthority: string;
		};
	}

	async validateCertificate(hostname: string) {
		const data = await this.#fetch(
			`
			query ValidateCertificate($appName: String!, $hostname: String!) {
				app(name: $appName) {
					certificate(hostname: $hostname) {
						id
						${/* including check triggers validation */ ''}
						check
						hostname
						clientStatus
						configured
						source
					}
				}
			}
		`,
			{
				appName: this.#appName,
				hostname,
			},
		);

		return data.app.certificate as {
			id: string;
			check: string;
			hostname: string;
			clientStatus: string;
			configured: boolean;
			source: string;
		};
	}

	async deprovisionCertificate(hostname: string) {
		const data = await this.#fetch(
			`
			mutation DeprovisionCertificate($appName: String!, $hostname: String!) {
				deleteCertificate(appId: $appName, hostname: $hostname) {
					certificate {
						id
						hostname
					}
				}
			}
		`,
			{
				appName: this.#appName,
				hostname,
			},
		);

		return data.deleteCertificate.certificate as {
			id: string;
			hostname: string;
		};
	}
}

export const fly = new FlyService();
