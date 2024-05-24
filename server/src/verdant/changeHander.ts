import { DocumentBaseline, Operation } from '@verdant-web/common';
import { parseLibraryName } from '@biscuits/libraries';
import { changeHandlers } from './changeHandlers/index.js';
import { logger } from '../logger.js';

export type ChangeData = {
  planId: string;
  appId: string;
  userId: string;
  operations: Operation[];
  baselines: DocumentBaseline[];
};
export type ChangeHandler<T> = {
  match: (data: ChangeData) => boolean;
  process: (
    data: ChangeData,
    get: () => T,
    schedule: (payload: T) => void,
  ) => Promise<void>;
  effect: (planId: string, userId: string, payload: T) => void;
};

class VerdantChangeListener {
  private debounceTimeSeconds = 10;
  private pendingNotifications = new Map<
    string,
    {
      timeout: NodeJS.Timeout;
      planId: string;
      userId: string;
      payload: any;
      listenerIndex: number;
    }
  >();

  constructor(private appListeners: ChangeHandler<any>[]) {}

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
    const data = {
      planId,
      appId: app,
      userId,
      operations,
      baselines,
    };
    for (let i = 0; i < this.appListeners.length; i++) {
      const listener = this.appListeners[i];
      if (listener.match(data)) {
        const get = () =>
          this.pendingNotifications.get(`${libraryId}:${userId}`)?.payload;
        const schedule = (payload: any) => {
          const existing = this.pendingNotifications.get(
            `${libraryId}:${userId}`,
          );
          if (existing) {
            clearTimeout(existing.timeout);
            existing.payload = payload;
            existing.timeout = this.schedule(`${libraryId}:${userId}`);
          } else {
            this.pendingNotifications.set(`${libraryId}:${userId}`, {
              planId,
              userId,
              payload,
              timeout: this.schedule(`${libraryId}:${userId}`),
              listenerIndex: i,
            });
          }
        };
        await listener.process(
          { planId, appId: app, userId, operations, baselines },
          get,
          schedule,
        );
      }
    }
  };

  private schedule = (key: string) => {
    return setTimeout(this.fire, this.debounceTimeSeconds * 1000, key);
  };

  private fire = async (key: string) => {
    const notification = this.pendingNotifications.get(key);
    if (!notification) return;

    const listener = this.appListeners[notification.listenerIndex];
    if (!listener) {
      logger.urgent(
        `No listener found for ${key} (index: ${notification.listenerIndex}). Something's off.`,
      );
    }

    this.pendingNotifications.delete(key);

    listener.effect(
      notification.planId,
      notification.userId,
      notification.payload,
    );
  };
}

export const changeListener = new VerdantChangeListener(changeHandlers);
