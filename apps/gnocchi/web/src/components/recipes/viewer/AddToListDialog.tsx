import { RecipeNote } from '@/components/recipes/viewer/RecipeNote.jsx';
import { saveHubRecipeOnboarding } from '@/onboarding/saveHubRecipeOnboarding.js';
import { hooks } from '@/stores/groceries/index.js';
import { ActionBar, ActionButton } from '@a-type/ui/components/actions';
import { Button } from '@a-type/ui/components/button';
import { Checkbox } from '@a-type/ui/components/checkbox';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@a-type/ui/components/dialog';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { CheckboxIcon, SquareIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { MultiplierStepper } from './MultiplierStepper.jsx';
import { RecipeIngredientViewer } from './RecipeIngredientViewer.jsx';

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
	const { ingredients, multiplier: defaultMultiplier } = hooks.useWatch(recipe);
	const [multiplier, setMultiplier] = useState(defaultMultiplier);
	const [adding, setAdding] = useState(false);
	const [loading, setLoading] = useState(false);

	const [checkedItems, setCheckedItems] = useState<boolean[]>(() => {
		return new Array(ingredients.length).fill(false).map((_, i) => {
			return !ingredients.get(i).get('isSectionHeader');
		});
	});
	const items = hooks.useWatch(ingredients);
	const [_, next] = saveHubRecipeOnboarding.useStep('addToList');

	// because this component stays mounted... have to reset this...
	const isReallyOpen = open === undefined ? adding : open;
	const setIsReallyOpen = onOpenChange === undefined ? setAdding : onOpenChange;
	useEffect(() => {
		if (isReallyOpen) {
			setMultiplier(defaultMultiplier);
		}
	}, [isReallyOpen, defaultMultiplier]);

	const addItems = hooks.useAddIngredients();
	const client = hooks.useClient();

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
						<ActionButton
							onClick={() => setCheckedItems((prev) => prev.map(() => true))}
							icon={<CheckboxIcon />}
						>
							Select all
						</ActionButton>
						<ActionButton
							onClick={() => setCheckedItems((prev) => prev.map(() => false))}
							icon={<SquareIcon />}
						>
							Select none
						</ActionButton>
					</ActionBar>
					<ul className="flex flex-col items-start list-none p-0 m-0 gap-3 w-full">
						{items.map((ingredient, index) => {
							const isSectionHeader = ingredient.get('isSectionHeader');
							return (
								<li
									key={index}
									className="flex flex-row items-start gap-2 w-full"
								>
									<Checkbox
										checked={checkedItems[index]}
										onCheckedChange={(checked) => {
											setCheckedItems((prev) => {
												const next = [...prev];
												next[index] = checked === true;
												return next;
											});
										}}
										className={
											isSectionHeader ? '[visibility:hidden]' : undefined
										}
										disabled={isSectionHeader}
										id={`ingredient-${index}`}
									/>
									<label
										htmlFor={`ingredient-${index}`}
										className={classNames(
											'flex-1',
											isSectionHeader ? 'font-bold' : undefined,
										)}
									>
										<RecipeIngredientViewer
											ingredient={ingredient}
											multiplier={multiplier}
											className="w-full"
											disableAddNote
											disableAddToList
											recipeId={recipe.get('id')}
										/>
									</label>
								</li>
							);
						})}
					</ul>
				</div>
				<DialogActions>
					<DialogClose asChild>
						<Button color="ghost">Cancel</Button>
					</DialogClose>
					<Button
						color="primary"
						loading={loading}
						onClick={async () => {
							setLoading(true);
							try {
								addItems(
									items.filter(
										(item, index) =>
											checkedItems[index] && !item.get('isSectionHeader'),
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
