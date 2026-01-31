import { getVerdantSync, VerdantContext } from '@biscuits/client';
import { graphql } from '@biscuits/graphql';
import {
	Client,
	createHooks,
	migrations,
	UserInfo,
} from '@gnocchi.biscuits/verdant';

export interface Presence {
	lastInteractedItem: string | null;
	viewingRecipeId: string | null;
	lastInteractedCategory: string | null;
}

export interface Profile {
	id: string;
	name: string;
	imageUrl?: string;
}

export type Person = UserInfo<Profile, Presence>;

export const foodLookupQuery = graphql(`
	query FoodLookup($food: String!) {
		food(name: $food) {
			id
			canonicalName
			alternateNames
			category {
				id
			}
		}
	}
`);

export const foodAssignMutation = graphql(`
	mutation AssignFoodCategory($input: AssignFoodCategoryInput!) {
		assignFoodCategory(input: $input) {
			food {
				id
			}
		}
	}
`);

export const defaultCategoriesQuery = graphql(`
	query DefaultCategories {
		categories: foodCategories {
			id
			name
			sortKey
		}
	}
`);

export const hooks = createHooks<Presence, Profile>({
	Context: VerdantContext,
});

const DEBUG = localStorage.getItem('DEBUG') === 'true';
const NO_SYNC = window.location.search.includes('nosync');
export function createClient(options: { namespace: string }) {
	return new Client({
		sync: NO_SYNC
			? undefined
			: getVerdantSync({
					appId: 'gnocchi',
					initialPresence: {
						lastInteractedItem: null,
						viewingRecipeId: null,
						lastInteractedCategory: null,
					} satisfies Presence,
					access: 'members',
			  }),
		migrations,
		namespace: options.namespace,
		log:
			import.meta.env.DEV || DEBUG
				? (level: string, ...args: any[]) => {
						if (level === 'debug') {
							if (DEBUG) {
								console.debug('🌿', ...args);
							}
						} else if (level === 'error' || level === 'critical') {
							console.error('🌿', ...args);
						} else if (level === 'warn') {
							console.warn('🌿', ...args);
						} else {
							console.debug('🌿', ...args);
						}
				  }
				: undefined,
		EXPERIMENTAL_weakRefs: true,
	});
}

export const verdant = createClient({
	namespace: 'groceries',
});
(window as any).groceries = verdant;
export type GnocchiClient = typeof verdant;

(window as any).stats = async () => {
	(await verdant).stats().then(console.info);
};

// hook up undo to ctrl+z
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

// startup tasks
// delete any purchased items older than 1 year
const purchased = await verdant.items.findAll({
	index: {
		where: 'purchased',
		equals: 'yes',
	},
}).resolved;
const now = Date.now();
const itemsToDelete = purchased
	.filter((item) => {
		const purchasedAt = item.get('purchasedAt');
		return purchasedAt && purchasedAt < now - 365 * 24 * 60 * 60 * 1000;
	})
	.map((i) => i.get('id'));
await verdant.items.deleteAll(itemsToDelete);

const backup = await import('@verdant-web/store/backup');
backup.transferOrigins(
	verdant,
	'https://gnocchi.club',
	'https://gnocchi.biscuits.club',
);
backup.transferOrigins(
	verdant,
	'http://localhost:6299',
	'http://localhost:6220',
);
