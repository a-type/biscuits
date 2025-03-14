import { BiscuitsError } from '@biscuits/error';
import { getLibraryName } from '@biscuits/libraries';
import { ReplicaType, TokenProvider } from '@verdant-web/server';
import { Hono } from 'hono';
import { sessions } from '../auth/session.js';
import { DEPLOYED_ORIGIN } from '../config/deployedContext.js';
import { Env } from '../config/hono.js';
import { VERDANT_SECRET } from '../config/secrets.js';
import { isPlanInGoodStanding } from '../management/plans.js';
import { verdantServer } from '../verdant/verdant.js';

export const verdantRouter = new Hono<Env>();

const tokenProvider = new TokenProvider({
	secret: VERDANT_SECRET,
});

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

	const planInGoodStanding = await isPlanInGoodStanding(session.planId);

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

	const syncEndpoint = DEPLOYED_ORIGIN + '/verdant';
	const fileEndpoint = DEPLOYED_ORIGIN + '/verdant/files';

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

	const token = tokenProvider.getToken({
		userId: session?.userId,
		libraryId,
		syncEndpoint,
		role: 'user',
		type: tokenType,
		expiresIn: '1d',
		fileEndpoint,
	});

	return new Response(JSON.stringify({ accessToken: token }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
});
verdantRouter.all('/', (ctx) => verdantServer.handleFetch(ctx.req.raw));
verdantRouter.all('/files/:fileId', (ctx) =>
	verdantServer.handleFileFetch(ctx.req.raw),
);
