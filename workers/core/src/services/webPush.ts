import webPush from 'web-push';
import { createDb, PushSubscription } from './db/index.js';

export async function sendPush(
	subscription: Pick<PushSubscription, 'auth' | 'p256dh' | 'endpoint'>,
	payload: any,
	env: Env,
) {
	if (!subscription.auth || !subscription.p256dh) {
		throw new Error('Invalid subscription, no keys');
	}
	try {
		webPush.setVapidDetails(
			'mailto:hi@gnocchi.club',
			env.VAPID_PUBLIC_KEY,
			env.VAPID_PRIVATE_KEY,
		);
		await webPush.sendNotification(
			{
				endpoint: subscription.endpoint,
				keys: {
					auth: subscription.auth,
					p256dh: subscription.p256dh,
				},
			},
			JSON.stringify(payload),
		);
	} catch (err) {
		if (isPushError(err)) {
			if (err.statusCode >= 400 && err.statusCode < 500) {
				const db = createDb(env.CORE_DB);
				await db
					.deleteFrom('PushSubscription')
					.where('endpoint', '=', subscription.endpoint)
					.execute();
				console.error('Push error', err.body);
				throw new Error('Subscription is no longer valid');
			}
		} else {
			console.error('Unknown error during push', err);
			throw new Error('Unknown error during push');
		}
	}
}

function isPushError(err: any): err is { statusCode: number; body: string } {
	return err.statusCode && err.body;
}
