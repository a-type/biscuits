import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { useAddIngredients } from '@/stores/groceries/mutations.js';
import {
	ActionBar,
	ActionButton,
	Box,
	Button,
	Checkbox,
	Dialog,
	Icon,
	Note,
	Text,
	Ul,
} from '@a-type/ui';
import {
	Client,
	Recipe,
	RecipeIngredientsItemSnapshot,
	RecipeSubRecipeMultipliers,
} from '@gnocchi.biscuits/verdant';
import { ReactNode, use, useEffect, useState } from 'react';
import { getSubRecipeIds } from '../hooks.js';
import { IngredientTextRenderer } from './IngredientText.jsx';
import { MultiplierStepper } from './MultiplierStepper.jsx';

export interface AddToListDialogProps {
	recipe: Recipe;
	listId?: string | null;
	children?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function AddToListDialog({
	recipe,
	children,
	listId,
	open,
	onOpenChange,
	...rest
}: AddToListDialogProps) {
	// set local multiplier from recipe default
	const { multiplier: defaultMultiplier } = hooks.useWatch(recipe);
	const [multiplier, setMultiplier] = useState(defaultMultiplier);
	const [adding, setAdding] = useState(false);
	const [loading, setLoading] = useState(false);

	const next = saveHubRecipeOnboarding.useNext('addToList');

	// because this component stays mounted... have to reset this...
	const isReallyOpen = open === undefined ? adding : open;
	const setIsReallyOpen = onOpenChange === undefined ? setAdding : onOpenChange;
	useEffect(() => {
		if (isReallyOpen) {
			setMultiplier(defaultMultiplier);
		}
	}, [isReallyOpen, defaultMultiplier]);

	const addItems = useAddIngredients();
	const allIngredients = useAllAddableIngredients(recipe);
	const [unchecked, setUnchecked] = useState({} as Record<string, boolean>);

	return (
		<Dialog open={isReallyOpen} onOpenChange={setIsReallyOpen} {...rest}>
			{children}
			<Dialog.Content>
				<Dialog.Title>Add to list</Dialog.Title>
				<Box col items="start" gap="sm">
					<RecipeNote recipe={recipe} readOnly />
					<MultiplierStepper
						highlightChange
						value={multiplier}
						onChange={setMultiplier}
					/>
					<ActionBar>
						<ActionButton onClick={() => setUnchecked({})}>
							<Icon name="check" />
							Select all
						</ActionButton>
						<ActionButton
							onClick={() =>
								setUnchecked(
									allIngredients.reduce<Record<string, boolean>>(
										(acc, item) => {
											acc[item.id] = true;
											return acc;
										},
										{},
									),
								)
							}
						>
							<Icon name="x" />
							Select none
						</ActionButton>
					</ActionBar>
					<Ul unstyled style={{ gap: 12, width: '100%' }}>
						{allIngredients.map((ingredient) => {
							const isSectionHeader = ingredient.isSectionHeader;

							if (isSectionHeader) {
								return (
									<Ul.Item key={ingredient.id}>
										<Text bold>{ingredient.text}</Text>
									</Ul.Item>
								);
							}

							return (
								<Box
									items="start"
									full="width"
									gap="sm"
									render={<Ul.Item />}
									key={ingredient.id}
								>
									<Checkbox
										checked={!unchecked[ingredient.id]}
										onCheckedChange={(checked) => {
											setUnchecked((v) => ({
												...v,
												[ingredient.id]: !checked,
											}));
										}}
										disabled={isSectionHeader}
										id={`ingredient-${ingredient.id}`}
									/>
									<Box
										col
										grow
										gap="xs"
										render={<label htmlFor={`ingredient-${ingredient.id}`} />}
									>
										<IngredientTextRenderer
											{...ingredient}
											multiplier={
												isSectionHeader
													? 1
													: (ingredient.multiplier ?? 1) * multiplier
											}
										/>
										{ingredient.note && (
											<Note style={{ alignSelf: 'end' }}>
												{ingredient.note}
											</Note>
										)}
									</Box>
								</Box>
							);
						})}
					</Ul>
				</Box>
				<Dialog.Actions>
					<Dialog.Close
						render={
							<Button
								emphasis="ghost"
								onClick={() => {
									next();
								}}
							/>
						}
					>
						Cancel
					</Dialog.Close>
					<Button
						emphasis="primary"
						loading={loading}
						onClick={async () => {
							setLoading(true);
							try {
								addItems(
									allIngredients.filter(
										(item) => !unchecked[item.id] && !item.isSectionHeader,
									),
									{
										title: recipe.get('title'),
										multiplier,
										recipeId: recipe.get('id'),
										listId,
										showToast: true,
									},
								);
								setAdding(false);
								onOpenChange?.(false);
							} catch (e) {
								console.error(e);
								onOpenChange?.(false);
								next();
							} finally {
								setLoading(false);
							}
						}}
					>
						Add
					</Button>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

type AddableIngredient = RecipeIngredientsItemSnapshot & {
	multiplier?: number;
	recipeId: string;
};

function useAllAddableIngredients(recipe: Recipe) {
	const client = hooks.useClient();

	const view = getIngredientsView(recipe.get('id'), client);
	const ingredients = view.ready ? view.result : [];
	use(view.loaded);
	return ingredients;
}

class RecipeAddableIngredientsView {
	readonly rootRecipeId: string;
	#client: Client;
	readonly loaded: Promise<AddableIngredient[]>;
	rawResult: Record<string, AddableIngredient[]> = {};
	#ready: boolean = false;
	get result() {
		// make sure root comes first
		const { [this.rootRecipeId]: root, ...rest } = this.rawResult;
		return [root, ...Object.values(rest)].flat();
	}
	get ready() {
		return this.#ready;
	}
	// discovered via traversal. cumulative over nested recipes.
	#cumulativeMultipliers: Record<string, number> = {};
	#unsubscribes: (() => void)[] = [];

	constructor(rootRecipeId: string, client: Client) {
		this.rootRecipeId = rootRecipeId;
		this.#client = client;
		this.loaded = this.#load();
	}

	/** Should only be called once, on initialization. */
	#load = async () => {
		await this.#loadRecipe(this.rootRecipeId);
		this.#ready = true;
		return this.result;
	};

	dispose = () => {
		this.#unsubscribes.forEach((u) => u());
	};

	#getRecipeMultiplier = (recipeId: string) => {
		return this.#cumulativeMultipliers[recipeId] ?? 1;
	};

	#loadRecipe = async (recipeId: string) => {
		const recipe = await this.#client.recipes.get(recipeId).resolved;
		if (!recipe) {
			console.error('Recipe not found:', recipeId);
			return;
		}

		const subRecipeMultipliers = recipe.get('subRecipeMultipliers');
		this.#applySubRecipeMultipliers(
			subRecipeMultipliers,
			this.#getRecipeMultiplier(recipeId),
		);
		this.#unsubscribes.push(
			subRecipeMultipliers.subscribe('change', () => {
				this.#applySubRecipeMultipliers(
					subRecipeMultipliers,
					this.#getRecipeMultiplier(recipeId),
				);
			}),
		);

		this.#applyRecipeIngredients(recipe);
		this.#unsubscribes.push(
			recipe.get('ingredients').subscribe('changeDeep', () => {
				this.#applyRecipeIngredients(recipe);
			}),
		);

		// sub-recipes
		const subRecipeIds = getSubRecipeIds(recipe);
		await Promise.allSettled(
			subRecipeIds.map((id) => {
				if (!this.rawResult[id]) {
					return this.#loadRecipe(id);
				}
			}),
		);
	};

	#applySubRecipeMultipliers = (
		multipliers: RecipeSubRecipeMultipliers,
		parentMultiplier: number,
	) => {
		const subRecipeMultipliers = multipliers.getSnapshot();
		for (const id of Object.keys(subRecipeMultipliers)) {
			subRecipeMultipliers[id] *= parentMultiplier;
		}
		Object.assign(this.#cumulativeMultipliers, subRecipeMultipliers);
	};

	#applyRecipeIngredients = (recipe: Recipe) => {
		const recipeId = recipe.get('id');
		const ingredients = recipe.get('ingredients');
		const snaps = (ingredients.getSnapshot() || []) as AddableIngredient[];
		const multiplier = this.#getRecipeMultiplier(recipeId);
		for (const snap of snaps) {
			snap.multiplier = multiplier;
			snap.recipeId = recipeId;
		}
		// if this is not the root recipe, add a 'title' item for the section header
		// ... but only if it has items
		if (recipeId !== this.rootRecipeId && snaps.length > 0) {
			snaps.unshift({
				text: `Sub-recipe: ${recipe.get('title')}`,
				isSectionHeader: true,
				multiplier,
				recipeId,
				comments: [],
				food: '',
				id: `section-header-${recipeId}`,
				note: '',
				quantity: 0,
				unit: '',
			});
		}
		this.rawResult[recipeId] = snaps;
	};
}

const ingredientsViewCache = new Map<string, RecipeAddableIngredientsView>();
function getIngredientsView(recipeId: string, client: Client) {
	let view = ingredientsViewCache.get(recipeId);
	if (!view) {
		view = new RecipeAddableIngredientsView(recipeId, client);
		ingredientsViewCache.set(recipeId, view);
	}
	return view!;
}
