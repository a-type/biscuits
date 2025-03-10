import { getVerdantSync, VerdantProfile } from '@biscuits/client';
import { ClientDescriptor, migrations, UserInfo } from '@post.biscuits/verdant';

export interface Presence {
	/**
	 * Put any transient presence state for users
	 * you want here
	 */
}

export type Participant = UserInfo<VerdantProfile, Presence>;

export const clientDescriptor = new ClientDescriptor({
	namespace: 'post',
	migrations,
	sync: getVerdantSync({
		appId: 'post',
		access: 'members',
		initialPresence: {},
	}),
	// log: console.debug,
});

// these are some helpers I like to use. You can delete them if you want.

async function exposeClientOnWindowForDebug() {
	const client = await clientDescriptor.open();
	(window as any).client = client;
}

async function registerUndoKeybinds() {
	const client = await clientDescriptor.open();
	document.addEventListener('keydown', async (e) => {
		if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
			e.preventDefault();
			const result = await client.undoHistory.undo();
			if (!result) {
				console.debug('Nothing to undo');
			}
		}
		if (
			(e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
			(e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey))
		) {
			e.preventDefault();
			const result = await client.undoHistory.redo();
			if (!result) {
				console.debug('Nothing to redo');
			}
		}
	});
}

exposeClientOnWindowForDebug();
registerUndoKeybinds();
