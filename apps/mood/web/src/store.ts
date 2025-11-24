import { getVerdantSync, VerdantProfile } from '@biscuits/client';
import { Client, migrations, UserInfo } from '@mood.biscuits/verdant';

export interface Presence {
	/**
	 * Put any transient presence state for users
	 * you want here
	 */
}

export type Participant = UserInfo<VerdantProfile, Presence>;

export const verdant = new Client({
	namespace: 'mood',
	migrations,
	sync: getVerdantSync({
		appId: 'mood',
		access: 'members',
		initialPresence: {},
	}),
});

(window as any).client = verdant;

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
