import { BiscuitsError } from '@biscuits/error';
import { getLibraryName } from '@biscuits/libraries';
import { createVerdantWorkerApp } from '@verdant-web/cloudflare';
import { ReplicaType, TokenProvider } from '@verdant-web/server';
import { Hono } from 'hono';
import { sessions } from '../auth/session.js';
import { HonoEnv } from '../config/hono.js';
import { isPlanInGoodStanding } from '../management/plans.js';

export const verdantRouter = new Hono<HonoEnv>();

const syncRouter = createVerdantWorkerApp({
	durableObjectBindingName: 'VERDANT_LIBRARY',
	tokenSecretBindingName: 'VERDANT_SECRET',
});

// const testApp = new Hono().all('*', (ctx) => {
// 	console.log({
// 		basePath: basePath(ctx),
// 		routePath: routePath(ctx),
// 		baseRoutePath: baseRoutePath(ctx),
// 		baseRoutePathMinusOne: baseRoutePath(ctx, -1),
// 	});
// 	return ctx.text('test', 500);
// });

verdantRouter.route('/sync', syncRouter);

verdantRouter.get('/token/:app', async (ctx) => {
	const session = await sessions.getSession(ctx);

	if (!session) {
		throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
	}

	// for Wish Wash, users can use sync for 1 person, fetch-based only,
	// with no subscription
	const appId = ctx.req.param('app');

	if (!session.planId) {
		throw new BiscuitsError(BiscuitsError.Code.NoPlan);
	}

	const planInGoodStanding = await isPlanInGoodStanding(
		session.planId,
		ctx.env,
	);

	if (!planInGoodStanding && appId !== 'wish-wash') {
		throw new BiscuitsError(BiscuitsError.Code.SubscriptionInactive);
	}

	const access = ctx.req.query('access') ?? 'members';
	if (access !== 'members' && access !== 'user') {
		throw new BiscuitsError(
			BiscuitsError.Code.BadRequest,
			'Invalid access type',
		);
	}

	const syncEndpoint = ctx.env.DEPLOYED_ORIGIN + '/verdant/sync';

	const libraryId = getLibraryName({
		planId: session.planId,
		app: ctx.req.param('app'),
		access,
		userId: session.userId,
	});
	let tokenType: ReplicaType;

	// free users can only use Push type for Wish Wash
	if (appId === 'wish-wash' && !planInGoodStanding) {
		tokenType = ReplicaType.Push;
	} else {
		tokenType = ReplicaType.Realtime;
	}

	const tokenProvider = new TokenProvider({ secret: ctx.env.VERDANT_SECRET });
	const token = tokenProvider.getToken({
		userId: session?.userId,
		libraryId,
		syncEndpoint,
		role: 'user',
		type: tokenType,
		expiresIn: '1d',
	});

	return new Response(JSON.stringify({ accessToken: token }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
});

verdantRouter.get('/files/:library/:fileId/:filename', async (ctx) => {
	const { library, fileId, filename } = ctx.req.param();
	const obj = await ctx.env.USER_FILES.get(`${library}/${fileId}/${filename}`);
	if (!obj?.body) {
		return ctx.text('file not found', 404);
	}
	return new Response(obj.body, {
		headers: {
			'Content-Type':
				obj.httpMetadata?.contentType || 'application/octet-stream',
		},
	});
});
