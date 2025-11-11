import { getVerdantSync, VerdantProfile } from '@biscuits/client';
import { Client, migrations, UserInfo } from '@names.biscuits/verdant';

export interface Presence {
	/**
	 * Put any transient presence state for users
	 * you want here
	 */
}

export type Participant = UserInfo<VerdantProfile, Presence>;

export const verdant = new Client({
	namespace: 'names',
	migrations,
	sync: getVerdantSync({
		appId: 'names',
		access: 'members',
		initialPresence: {},
	}),
	log: console.debug,
});

// these are some helpers I like to use. You can delete them if you want.

async function exposeClientOnWindowForDebug() {
	const client = verdant;
	(window as any).client = client;
}

async function registerUndoKeybinds() {
	const client = verdant;
	document.addEventListener('keydown', async (e) => {
		if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
			e.preventDefault();
			const result = await client.undoHistory.undo();
			if (!result) {
				console.log('Nothing to undo');
			}
		}
		if (
			(e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
			(e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey))
		) {
			e.preventDefault();
			const result = await client.undoHistory.redo();
			if (!result) {
				console.log('Nothing to redo');
			}
		}
	});
}

exposeClientOnWindowForDebug();
registerUndoKeybinds();
