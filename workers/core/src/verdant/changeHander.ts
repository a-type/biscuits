import { parseLibraryName } from '@biscuits/libraries';
import { DocumentBaseline, Operation } from '@verdant-web/common';
import { logger } from '../logger.js';
import { changeHandlers } from './changeHandlers/index.js';

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
		change: ChangeData,
		ctx: {
			get: () => T;
			schedule: (payload: T) => void;
			env: Env;
		},
	) => Promise<void>;
	effect: (
		info: {
			planId: string;
			userId: string;
			payload: T;
		},
		ctx: {
			env: Env;
		},
	) => void;
};

export class VerdantChangeListener {
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
	appListeners = changeHandlers;

	constructor(private env: Env) {}

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
					{
						get,
						schedule,
						env: this.env,
					},
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

		listener.effect(notification, { env: this.env });
	};
}
