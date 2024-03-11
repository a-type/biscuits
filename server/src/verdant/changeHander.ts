import { DocumentBaseline, Operation, decomposeOid } from '@verdant-web/common';
import { sendPush } from '../services/webPush.js';
import type { AppId } from '@biscuits/apps';
import { parseLibraryName } from '@biscuits/libraries';
import { db } from '@biscuits/db';
import { changeHandlers } from './changeHandlers/index.js';

export type ChangeData = {
  planId: string;
  appId: string;
  userId: string;
  operations: Operation[];
  baselines: DocumentBaseline[];
};
export type ChangeHandler<T> = (
  data: ChangeData,
  get: () => T,
  schedule: (payload: T) => void,
) => Promise<void>;

class VerdantChangeListener {
  private debounceTimeSeconds = 10;
  private pendingNotifications = new Map<
    string,
    {
      timeout: NodeJS.Timeout;
      planId: string;
      userId: string;
      payload: any;
    }
  >();

  constructor(
    private appListeners: Partial<Record<AppId, ChangeHandler<any>>>,
  ) {}

  update = async (
    {
      libraryId,
      userId,
    }: {
      libraryId: string;
      userId: string;
    },
    operations: Operation[],
    baselines: DocumentBaseline[],
  ) => {
    const { app, planId } = parseLibraryName(libraryId);
    const listener = this.appListeners[app as AppId];
    if (listener) {
      const get = () =>
        this.pendingNotifications.get(`${libraryId}:${userId}`)?.payload;
      const schedule = () => {
        const existing = this.pendingNotifications.get(
          `${libraryId}:${userId}`,
        );
        if (existing) {
          clearTimeout(existing.timeout);
        }
        this.schedule(`${libraryId}:${userId}`);
      };
      await listener(
        { planId, appId: app, userId, operations, baselines },
        get,
        schedule,
      );
    }
  };

  private schedule = (key: string) => {
    return setTimeout(this.fire, this.debounceTimeSeconds * 1000, key);
  };

  private fire = async (key: string) => {
    const notification = this.pendingNotifications.get(key);
    if (!notification) return;

    this.pendingNotifications.delete(key);

    // send a notification to all other users in the plan
    const planId = notification.planId;
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
    const sender = subscriptions.find(
      (sub) => sub.userId === notification.userId,
    );
    const senderName = sender?.friendlyName ?? sender?.fullName ?? 'Someone';
    console.info(
      `Sending push notification for changes to ${notification.planId} by ${notification.userId}`,
    );
    for (const sub of subscriptions) {
      // do not send to originator of change
      if (sub.userId === notification.userId) continue;

      if (sub.auth && sub.p256dh) {
        await sendPush(sub, {
          originatorName: senderName,
          payload: notification.payload,
        });
      }
    }
  };
}

export const changeListener = new VerdantChangeListener(changeHandlers);
