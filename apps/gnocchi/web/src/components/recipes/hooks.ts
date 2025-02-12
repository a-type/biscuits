import { SESSION_TIMEOUT } from '@/components/recipes/constants.js';
import { hooks } from '@/stores/groceries/index.js';
import { assert } from '@a-type/utils';
import {
	ObjectEntity,
	Recipe,
	RecipeDestructured,
	RecipeSession,
} from '@gnocchi.biscuits/verdant';
import Link from '@tiptap/extension-link';
import { AnyExtension, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useRef } from 'react';
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
	return useSyncedEditor(
		recipe,
		'instructions',
		readonly,
		createTiptapExtensions(recipe, useBasicEditor),
	);
}

export function useSyncedPreludeEditor(recipe: Recipe, readonly = false) {
	return useSyncedEditor(recipe, 'prelude', readonly, [StarterKit, Link]);
}

function useSyncedEditor(
	recipe: Recipe,
	fieldName: keyof RecipeDestructured,
	readonly: boolean,
	extensions: AnyExtension[],
) {
	const live = hooks.useWatch(recipe);
	const field = live[fieldName] as ObjectEntity<any, any>;
	const updatingRef = useRef(false);
	const update = useCallback(
		(editor: any) => {
			if (updatingRef.current) {
				return;
			}

			const newData = editor.getJSON();
			const value = recipe.get(fieldName) as ObjectEntity<any, any> | null;
			if (!value) {
				recipe.set(fieldName, newData);
			} else {
				value.update(newData, {
					merge: false,
					replaceSubObjects: false,
				});
			}
		},
		[recipe],
	);

	const editor = useEditor(
		{
			extensions,
			content: ensureDocShape(field?.getSnapshot()),
			editable: !readonly,
			onUpdate: ({ editor }) => {
				update(editor);
			},
		},
		[field, update],
	);

	useEffect(() => {
		if (editor && !editor.isDestroyed && field) {
			updatingRef.current = true;
			const { from, to } = editor.state.selection;
			editor.commands.setContent(ensureDocShape(field.getSnapshot()), false);
			editor.commands.setTextSelection({ from, to });
			updatingRef.current = false;
		}

		return field?.subscribe('changeDeep', (target, info) => {
			if (!info.isLocal || target === field) {
				updatingRef.current = true;
				if (editor) {
					const { from, to } = editor.state.selection;
					editor.commands.setContent(
						ensureDocShape(field.getSnapshot()),
						false,
					);
					editor.commands?.setTextSelection({ from, to });
				}
				updatingRef.current = false;
			}
		});
	}, [field, editor]);

	return editor;
}

function ensureDocShape(json: any) {
	if (!json || !json.type) {
		return {
			type: 'doc',
			content: [],
		};
	}
	for (const node of json.content) {
		// since the schema doesn't enforce this shape but it's
		// needed for the editor to work, we'll ensure it here
		if (node.type === 'step' && !node.content) {
			node.content = [];
		} else if (node.type === 'step') {
			// remove undefined nodes
			node.content = node.content.filter((n: any) => !!n);
		}
	}
	return json;
}

/**
 * Updates the updatedAt timestamp for any changes to
 * instructions, ingredients, or prelude.
 */
export function useWatchChanges(recipe: Recipe) {
	const { ingredients, instructions, prelude } = hooks.useWatch(recipe);

	useEffect(() => {
		const unsubs = new Array<() => void>();
		const updateTime = () => {
			recipe.set('updatedAt', Date.now());
		};
		unsubs.push(ingredients.subscribe('changeDeep', updateTime));
		unsubs.push(instructions.subscribe('changeDeep', updateTime));
		unsubs.push(prelude.subscribe('changeDeep', updateTime));
		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	}, [ingredients, instructions, prelude]);
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
