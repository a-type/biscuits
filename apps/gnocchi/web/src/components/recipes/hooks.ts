import { SESSION_TIMEOUT } from '@/components/recipes/constants.js';
import { hooks } from '@/stores/groceries/index.js';
import { assert } from '@a-type/utils';
import { Recipe, RecipeSession } from '@gnocchi.biscuits/verdant';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { useSyncedEditor } from '@verdant-web/tiptap/react';
import { useCallback, useEffect } from 'react';
import { createTiptapExtensions } from './editor/tiptapExtensions.js';

export function useRecipeFromSlugUrl(url: string) {
	const slug = url.split('-').pop();
	const recipe = hooks.useOneRecipe({
		index: {
			where: 'slug',
			equals: slug,
		},
	});
	return recipe;
}

/**
 * Clears any expired session, forces that a session exists,
 * then runs the action with that session.
 */
export function useCookSessionAction(recipe: Recipe | null) {
	const client = hooks.useClient();
	return useCallback(
		(action: (session: RecipeSession) => void) => {
			if (!recipe) {
				return;
			}
			let session = recipe.get('session');
			if (!session || session.get('startedAt') < Date.now() - SESSION_TIMEOUT) {
				client
					.batch({ undoable: false })
					.run(() => {
						recipe.set('session', {
							completedIngredients: [],
							completedInstructions: [],
							ingredientAssignments: {},
							instructionAssignments: {},
							startedAt: Date.now(),
						});
						recipe.set('cookCount', recipe.get('cookCount') + 1);
						recipe.set('lastCookedAt', Date.now());
						session = recipe.get('session');
					})
					.commit();
			}
			assert(session);
			action(session);
		},
		[recipe, client],
	);
}

export function useActiveCookingSession(recipe: Recipe) {
	const { session } = hooks.useWatch(recipe);
	if (!session) {
		return null;
	}
	return isActiveCookingSession(session) ? session : null;
}

export function isActiveCookingSession(session: RecipeSession | null) {
	if (!session) {
		return false;
	}
	return session.get('startedAt') > Date.now() - SESSION_TIMEOUT;
}

export function useSyncedInstructionsEditor({
	recipe,
	readonly = false,
	useBasicEditor = false,
}: {
	recipe: Recipe;
	readonly?: boolean;
	useBasicEditor?: boolean;
}) {
	return useSyncedEditor(recipe, 'instructions', {
		editorOptions: {
			editable: !readonly,
			extensions: createTiptapExtensions(recipe, useBasicEditor),
		},
	});
}

export function useSyncedPreludeEditor(recipe: Recipe, readonly = false) {
	return useSyncedEditor(recipe, 'prelude', {
		editorOptions: {
			editable: !readonly,
			extensions: [
				StarterKit.configure({ history: false }),
				Link.configure({
					openOnClick: 'whenNotEditable',
				}),
			],
		},
	});
}

/**
 * Updates the updatedAt timestamp for any changes to
 * instructions, ingredients, or prelude.
 */
export function useWatchChanges(recipe: Recipe) {
	const { ingredients, instructions, prelude } = hooks.useWatch(recipe);
	const client = hooks.useClient();

	useEffect(() => {
		const unsubs = new Array<() => void>();
		const updateTime = () => {
			client
				.batch({ undoable: false })
				.run(() => {
					recipe.set('updatedAt', Date.now());
				})
				.commit();
		};
		unsubs.push(ingredients.subscribe('changeDeep', updateTime));
		unsubs.push(instructions.subscribe('changeDeep', updateTime));
		unsubs.push(prelude.subscribe('changeDeep', updateTime));
		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	}, [ingredients, instructions, prelude, recipe, client]);
}

export function useSubRecipeIds(recipe: Recipe) {
	const { instructions, subRecipeMultipliers } = hooks.useWatch(recipe);
	hooks.useWatch(instructions, { deep: true });
	hooks.useWatch(subRecipeMultipliers);
	return getSubRecipesWithMultipliers(recipe);
}

export function getSubRecipeIds(recipe: Recipe) {
	const instructions = recipe.get('instructions');
	const snapshot = instructions.getSnapshot();

	const subRecipeIds: string[] = (snapshot.content ?? [])
		.map((node: any) => node?.attrs?.subRecipeId)
		.filter((id: string) => !!id);

	return subRecipeIds;
}

export function getSubRecipesWithMultipliers(recipe: Recipe) {
	const subRecipeIds = getSubRecipeIds(recipe);
	const subRecipeMultipliers = recipe.get('subRecipeMultipliers');

	const withMultipliers = subRecipeIds.reduce<{ [id: string]: number }>(
		(acc, id) => {
			acc[id] = subRecipeMultipliers.get(id) ?? 1;
			return acc;
		},
		{},
	);

	return withMultipliers;
}
