import { DurableObjectLibrary, R2FileStorage } from '@verdant-web/cloudflare';
import { LibraryApi } from '@verdant-web/server';
import { DurableObject } from 'cloudflare:workers';
import { Logger } from '../logger.js';
import { Profiles } from './Profiles.js';
import { VerdantChangeListener } from './changeHander.js';

export class VerdantLibrary extends DurableObject<Env> implements LibraryApi {
	private verdant: DurableObjectLibrary;
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		const logger = new Logger('🌿');
		this.verdant = new DurableObjectLibrary(ctx, {
			tokenSecret: env.VERDANT_SECRET,
			fileStorage: new R2FileStorage({
				// see verdant router
				host: env.DEPLOYED_ORIGIN + '/verdant/files',
				bucket: env.USER_FILES,
			}),
			profiles: new Profiles(env.CORE_DB),
			log: (level, ...args) => {
				if (level in logger) {
					logger[level as keyof Logger](...args);
				} else {
					logger.debug(...args);
				}
			},
		});
		const changeListener = new VerdantChangeListener(env);
		this.verdant.events.subscribe('changes', changeListener.update);
	}

	// mandatory bindings
	fetch(request: Request) {
		return this.verdant.fetch(request);
	}
	webSocketMessage(
		ws: WebSocket,
		message: string | ArrayBuffer,
	): void | Promise<void> {
		return this.verdant.webSocketMessage(ws, message);
	}
	webSocketError(ws: WebSocket, error: unknown): void | Promise<void> {
		return this.verdant.webSocketError(ws, error);
	}
	webSocketClose(
		ws: WebSocket,
		code: number,
		reason: string,
		wasClean: boolean,
	): void | Promise<void> {
		return this.verdant.webSocketClose(ws, code, reason, wasClean);
	}

	async isInitialized() {
		try {
			await this.verdant.getInfo();
		} catch (e) {
			if ((e as Error).name === 'TypeError') {
				return false;
			}
			throw e;
		}
		return true;
	}

	// Library API
	getInfo() {
		return this.verdant.getInfo();
	}
	evict() {
		return this.verdant.evict();
	}
	getFileInfo(fileId: string) {
		return this.verdant.getFileInfo(fileId);
	}
	getDocumentSnapshot(collection: string, id: string) {
		return this.verdant.getDocumentSnapshot(collection, id);
	}
	forceTruant(replicaId: string) {
		return this.verdant.forceTruant(replicaId);
	}
}
