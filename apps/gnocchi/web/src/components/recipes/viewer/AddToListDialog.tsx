import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { useAddIngredients } from '@/stores/groceries/mutations.js';
import {
	ActionBar,
	ActionButton,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	Note,
} from '@a-type/ui';
import {
	Client,
	Recipe,
	RecipeIngredientsItemSnapshot,
	RecipeSubRecipeMultipliers,
} from '@gnocchi.biscuits/verdant';
import { CheckboxIcon, SquareIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
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
			<DialogContent>
				<DialogTitle>Add to list</DialogTitle>
				<div className="flex flex-col items-start gap-3">
					<RecipeNote recipe={recipe} readOnly />
					<MultiplierStepper
						highlightChange
						value={multiplier}
						onChange={setMultiplier}
					/>
					<ActionBar>
						<ActionButton onClick={() => setUnchecked({})}>
							<CheckboxIcon />
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
							<SquareIcon />
							Select none
						</ActionButton>
					</ActionBar>
					<ul className="flex flex-col items-start list-none p-0 m-0 gap-3 w-full">
						{allIngredients.map((ingredient) => {
							const isSectionHeader = ingredient.isSectionHeader;
							return (
								<li
									key={ingredient.id}
									className="flex flex-row items-start gap-2 w-full"
								>
									<Checkbox
										checked={!unchecked[ingredient.id]}
										onCheckedChange={(checked) => {
											setUnchecked((v) => ({
												...v,
												[ingredient.id]: !checked,
											}));
										}}
										className={
											isSectionHeader ? '[visibility:hidden]' : undefined
										}
										disabled={isSectionHeader}
										id={`ingredient-${ingredient.id}`}
									/>
									<label
										htmlFor={`ingredient-${ingredient.id}`}
										className={classNames(
											'flex-1 flex flex-col gap-1',
											isSectionHeader ? 'font-bold' : undefined,
										)}
									>
										<IngredientTextRenderer
											{...ingredient}
											multiplier={
												isSectionHeader
													? 1
													: (ingredient.multiplier ?? 1) * multiplier
											}
											className="flex-1 block mt-1"
										/>
										{ingredient.note && (
											<Note className="self-end">{ingredient.note}</Note>
										)}
									</label>
								</li>
							);
						})}
					</ul>
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button
							emphasis="ghost"
							onClick={() => {
								next();
							}}
						>
							Cancel
						</Button>
					</DialogClose>
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
				</DialogActions>
			</DialogContent>
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
