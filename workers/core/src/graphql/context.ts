import { Session } from '@a-type/auth';
import { DB } from '@biscuits/db';
import { Context } from 'hono';
import Stripe from 'stripe';
import { HonoEnv } from '../config/hono.js';
import { CustomHostsService } from '../services/customHosts.js';
import { DomainRouteService } from '../services/domainRouteCache.js';
import { Maps } from '../services/maps.js';
import { Weather } from '../services/weather.js';
import { createDataloaders } from './dataloaders/index.js';

export type GQLContext = {
	session: Session | null;
	req: Request;
	db: DB;
	auth: {
		setLoginSession: (session: Session | null) => Promise<void>;
		applyHeaders: Headers;
	};
	stripe: Stripe;
	customHosts: CustomHostsService;
	dataloaders: ReturnType<typeof createDataloaders>;
	reqCtx: Context<HonoEnv>;
	domainRoutes: DomainRouteService;
	maps: Maps;
	weather: Weather;
};
