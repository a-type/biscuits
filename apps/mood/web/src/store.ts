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

// on startup delete metadata for unused tags
async function cleanupTags() {
	const unusedTags = await verdant.tagMetadata.findAll({
		index: {
			where: 'useCount',
			equals: 0,
		},
	}).resolved;
	// filter only to those not used in the last 30 days
	const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
	const tagsToCleanUp = unusedTags.filter((tag) => {
		const lastUsedAt = tag.get('lastUsedAt');
		return lastUsedAt < thirtyDaysAgo;
	});
	if (tagsToCleanUp.length > 0) {
		console.log(`Cleaning up ${tagsToCleanUp.length} unused tags`);
		for (const tag of tagsToCleanUp) {
			await verdant.tagMetadata.delete(tag.uid);
		}
	}
}
cleanupTags();
