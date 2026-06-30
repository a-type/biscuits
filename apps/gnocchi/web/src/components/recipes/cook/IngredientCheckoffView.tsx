import {
	useActiveCookingSession,
	useCookSessionAction,
} from '@/components/recipes/hooks.js';
import { hooks } from '@/stores/groceries/index.js';
import { Checkbox } from '@a-type/ui';
import { Recipe, RecipeIngredientsItem } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { RecipeIngredientViewer } from '../viewer/RecipeIngredientViewer.jsx';
import cls from './IngredientCheckoffView.module.css';

export interface IngredientCheckoffViewProps {
	recipe: Recipe;
	className?: string;
	multiplierOverride?: number;
}

export const IngredientCheckoffView = forwardRef<
	HTMLUListElement,
	IngredientCheckoffViewProps
>(function IngredientCheckoffView(
	{ recipe, className, multiplierOverride },
	ref,
) {
	const session = useActiveCookingSession(recipe);
	hooks.useWatch(session);
	const sessionAction = useCookSessionAction(recipe);
	const completedIngredients = session?.get('completedIngredients') ?? null;
	hooks.useWatch(completedIngredients);
	const { ingredients, multiplier: baseMultiplier } = hooks.useWatch(recipe);
	hooks.useWatch(ingredients);

	const multiplier = multiplierOverride ?? baseMultiplier;

	return (
		<ul ref={ref} className={classNames(cls.root, className)}>
			{ingredients.map((ingredient) => (
				<IngredientCheckoffItem
					key={ingredient.get('id')}
					ingredient={ingredient}
					multiplier={multiplier}
					checked={completedIngredients?.has(ingredient.get('id')) ?? false}
					recipeId={recipe.get('id')}
					onCheckedChange={(checked) => {
						sessionAction((session) => {
							if (checked) {
								session?.get('completedIngredients').add(ingredient.get('id'));
							} else {
								session
									?.get('completedIngredients')
									.removeAll(ingredient.get('id'));
							}
						});
					}}
				/>
			))}
		</ul>
	);
});

function IngredientCheckoffItem({
	ingredient,
	onCheckedChange,
	checked,
	multiplier,
	recipeId,
}: {
	ingredient: RecipeIngredientsItem;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	multiplier?: number;
	recipeId: string;
}) {
	const { isSectionHeader } = hooks.useWatch(ingredient);
	return (
		<li className={cls.item}>
			{!isSectionHeader && (
				<Checkbox
					checked={checked}
					onCheckedChange={(checked) => onCheckedChange(checked === true)}
					checkedMode="faded"
				/>
			)}
			<RecipeIngredientViewer
				style={{ flex: 1 }}
				ingredient={ingredient}
				multiplier={multiplier}
				recipeId={recipeId}
			/>
		</li>
	);
}
