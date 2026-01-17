import { createDb } from '@biscuits/db';
import { decomposeOid } from '@verdant-web/common';
import { sendPush } from '../../services/webPush.js';
import { ChangeHandler } from '../changeHander.js';

export const gnocchiListNotifications: ChangeHandler<{
	createdItemCount: number;
	purchasedItemCount: number;
}> = {
	match: (data) => data.appId === 'gnocchi',
	process: async (info, { get, schedule }) => {
		// looking at operations on "item" entities that match the criteria...
		// 1. "initialize" op type
		// 2. "set" on "purchasedAt" field
		let createdItemCount = 0;
		let purchasedItemCount = 0;
		for (const { data, oid } of info.operations) {
			const { collection, subId } = decomposeOid(oid);
			// only interested in top-level item changes
			if (collection !== 'items' || subId) continue;

			if (data.op === 'initialize') {
				createdItemCount++;
			} else if (
				data.op === 'set' &&
				data.name === 'purchasedAt' &&
				!!data.value
			) {
				purchasedItemCount++;
			}
		}

		if (createdItemCount || purchasedItemCount) {
			console.log('list changes detected');
			const existing = get();
			if (existing) {
				schedule({
					createdItemCount: existing.createdItemCount + createdItemCount,
					purchasedItemCount: existing.purchasedItemCount + purchasedItemCount,
				});
			} else {
				schedule({
					createdItemCount,
					purchasedItemCount,
				});
			}
		}
	},
	effect: async ({ planId, userId, payload }, { env }) => {
		const db = createDb(env.CORE_DB);
		// send a notification to all other users in the plan
		const subscriptions = await db
			.selectFrom('PushSubscription')
			.leftJoin('User', 'PushSubscription.userId', 'User.id')
			.where('User.planId', '=', planId)
			.select([
				'PushSubscription.p256dh',
				'PushSubscription.auth',
				'PushSubscription.endpoint',
				'User.friendlyName',
				'User.fullName',
				'User.id as userId',
			])
			.execute();
		const sender = subscriptions.find((sub) => sub.userId === userId);
		const senderName = sender?.friendlyName ?? sender?.fullName ?? 'Someone';
		console.info(
			`Sending push notification for changes to ${planId} by ${userId}`,
		);
		for (const sub of subscriptions) {
			// do not send to originator of change
			if (sub.userId === userId) continue;

			if (sub.auth && sub.p256dh) {
				await sendPush(
					sub,
					{
						originatorName: senderName,
						payload,
					},
					env,
				);
			}
		}
	},
};
