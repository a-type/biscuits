import { decomposeOid } from '@verdant-web/common';
import { ChangeHandler } from '../changeHander.js';
import { db } from '@biscuits/db';
import { sendPush } from '../../services/webPush.js';
import { GNOCCHI_HUB_CLOUDFRONT_ID } from '../../config/secrets.js';
import { logger } from '../../logger.js';
import { cloudfront, createInvalidation } from '../../services/cloudfront.js';

export const gnocchiListNotifications: ChangeHandler<{
  createdItemCount: number;
  purchasedItemCount: number;
}> = {
  match: (data) => data.appId === 'gnocchi',
  process: async (info, get, schedule) => {
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
  effect: async (planId, userId, payload) => {
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
        await sendPush(sub, {
          originatorName: senderName,
          payload,
        });
      }
    }
  },
};

export const gnocchiRecipeInvalidate: ChangeHandler<{
  recipeId: string;
}> = {
  match: (data) => data.appId === 'gnocchi',
  process: async (info, get, schedule) => {
    // looking at operations on "recipe" entities that match the criteria...
    // 1. "set" op type
    // 2. "updatedAt" field
    for (const { data, oid } of info.operations) {
      const { collection, subId } = decomposeOid(oid);
      if (collection !== 'recipes' || subId) continue;

      if (data.op === 'set' && data.name === 'updatedAt') {
        console.log('recipe update detected');
        schedule({
          recipeId: oid,
        });
      }
    }
  },
  effect: async (planId, userId, { recipeId }) => {
    if (!GNOCCHI_HUB_CLOUDFRONT_ID) {
      logger.warn(
        'No CloudFront distribution ID for Gnocchi Hub; cannot invalidate recipe.',
      );
      return;
    }

    // is this recipe published?
    const recipe = await db
      .selectFrom('PublishedRecipe')
      .where('id', '=', recipeId)
      .select(['publishedAt', 'slug'])
      .executeTakeFirst();

    if (recipe) {
      // invalidate the recipe in CloudFront
      console.info(`Invalidating recipe ${recipeId} for ${planId}`);

      createInvalidation(GNOCCHI_HUB_CLOUDFRONT_ID, [
        `/recipes/${recipe.slug}`,
      ]);
    }
  },
};
