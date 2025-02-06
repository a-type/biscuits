import { hooks } from '@/stores/groceries/index.js';
import { Box, clsx, H4 } from '@a-type/ui';
import { fractionToText } from '@a-type/utils';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { createContext, Suspense } from 'react';
import { IngredientCheckoffView } from '../cook/IngredientCheckoffView.jsx';
import { useSubRecipeIds } from '../hooks.js';

export interface RecipeIngredientsViewerProps {
	recipe: Recipe;
	multiplierOverride?: number;
	className?: string;
}

export function RecipeIngredientsViewer({
	recipe,
	multiplierOverride,
	className,
}: RecipeIngredientsViewerProps) {
	return (
		<Box
			direction="col"
			p="none"
			gap="md"
			className={clsx('w-full', className)}
		>
			<IngredientCheckoffView
				recipe={recipe}
				multiplierOverride={multiplierOverride}
			/>
			<NestedRecipeIngredientsContext value={true}>
				<EmbeddedRecipesIngredients recipe={recipe} />
			</NestedRecipeIngredientsContext>
		</Box>
	);
}

const NestedRecipeIngredientsContext = createContext<boolean>(false);

export function EmbeddedRecipesIngredients({ recipe }: { recipe: Recipe }) {
	const embeddedIds = useSubRecipeIds(recipe);
	const { multiplier: baseMult } = hooks.useWatch(recipe);

	if (Object.keys(embeddedIds).length === 0) {
		return null;
	}

	return (
		<Box direction="col" p="none" gap="md">
			{Object.entries(embeddedIds).map(([id, mult]) => (
				<Suspense key={id}>
					<EmbeddedRecipeIngredients
						id={id}
						multiplier={mult * baseMult}
						parent={recipe}
					/>
				</Suspense>
			))}
		</Box>
	);
}

function EmbeddedRecipeIngredients({
	id,
	multiplier,
	parent,
}: {
	id: string;
	multiplier: number;
	parent: Recipe;
}) {
	const recipe = hooks.useRecipe(id);

	// not technically observable-safe but probably fine
	if (!recipe?.get('ingredients')?.length) {
		return null;
	}

	const multText = multiplier === 1 ? '' : ` (×${fractionToText(multiplier)})`;

	return (
		<>
			<Box justify="between" items="center" p="none" gap="md">
				<H4 className="color-gray-7 italic">
					<span className="font-medium">From sub-recipe</span>{' '}
					{recipe.get('title')}
					{multText}
				</H4>
			</Box>
			<RecipeIngredientsViewer
				recipe={recipe}
				multiplierOverride={multiplier}
			/>
		</>
	);
}
