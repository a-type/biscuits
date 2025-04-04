import { Session } from '@a-type/auth';
import { DB } from '@biscuits/db';
import { Server as VerdantServer } from '@verdant-web/server';
import { Context } from 'hono';
import Stripe from 'stripe';
import { Env } from '../config/hono.js';
import { CustomHostsService } from '../services/customHosts.js';
import { DomainRouteService } from '../services/domainRouteCache.js';
import { FlyService } from '../services/fly.js';
import { createDataloaders } from './dataloaders/index.js';

export type GQLContext = {
	session: Session | null;
	req: Request;
	db: DB;
	verdant: VerdantServer;
	auth: {
		setLoginSession: (session: Session | null) => Promise<void>;
		applyHeaders: Headers;
	};
	stripe: Stripe;
	fly: FlyService;
	customHosts: CustomHostsService;
	dataloaders: ReturnType<typeof createDataloaders>;
	reqCtx: Context<Env>;
	domainRoutes: DomainRouteService;
};
