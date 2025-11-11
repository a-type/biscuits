import { getVerdantSync, VerdantProfile } from '@biscuits/client';
import { Client, UserInfo } from '@wish-wash.biscuits/verdant';
import { undoHistory } from './undo.js';

export interface Presence {
	/**
	 * Put any transient presence state for users
	 * you want here
	 */
}

export type Participant = UserInfo<VerdantProfile, Presence>;

export const verdant = new Client({
	namespace: 'wish-wash',
	undoHistory,
	sync: getVerdantSync({
		appId: 'wish-wash',
		access: 'members',
		initialPresence: {} satisfies Presence,
	}),
	log: console.debug,
});

// these are some helpers I like to use. You can delete them if you want.

(window as any).client = verdant;

async function registerUndoKeybinds() {
	document.addEventListener('keydown', async (e) => {
		if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
			e.preventDefault();
			const result = await verdant.undoHistory.undo();
			if (!result) {
				console.log('Nothing to undo');
			}
		}
		if (
			(e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
			(e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey))
		) {
			e.preventDefault();
			const result = await verdant.undoHistory.redo();
			if (!result) {
				console.log('Nothing to redo');
			}
		}
	});
}
registerUndoKeybinds();
