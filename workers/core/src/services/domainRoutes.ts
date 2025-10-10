import { DomainRouteService } from '@biscuits/domain-routes';
import { env } from 'cloudflare:workers';

export const domainRoutes = new DomainRouteService(
	env.CORE_DB,
	env.DOMAIN_ROUTES,
);
