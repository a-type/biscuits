import { DomainRouteService } from '@biscuits/domain-routes';
import { env } from 'cloudflare:workers';

export const domainRoutes = new DomainRouteService(
	env.CORE_DB,
	env.DOMAIN_ROUTES,
);

export function getTld(hostname: string) {
	const parts = hostname.split('.');
	if (parts.length <= 2) {
		return hostname;
	}
	const tld = parts.pop();
	const domain = parts.pop();
	return [domain, tld].join('.');
}
