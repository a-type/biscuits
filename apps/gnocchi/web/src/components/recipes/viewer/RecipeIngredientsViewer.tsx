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
			container="reset"
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
					<EmbeddedRecipeIngredients id={id} multiplier={mult * baseMult} />
				</Suspense>
			))}
		</Box>
	);
}

function EmbeddedRecipeIngredients({
	id,
	multiplier,
}: {
	id: string;
	multiplier: number;
}) {
	const recipe = hooks.useRecipe(id);
	if (!recipe) return null;

	return (
		<EmbeddedRecipeIngredientsImpl recipe={recipe} multiplier={multiplier} />
	);
}

function EmbeddedRecipeIngredientsImpl({
	recipe,
	multiplier,
}: {
	recipe: Recipe;
	multiplier: number;
}) {
	const embedded = useSubRecipeIds(recipe);
	const { ingredients } = hooks.useWatch(recipe);
	if (!ingredients.length && !Object.keys(embedded).length) {
		return null;
	}

	const multText = multiplier === 1 ? '' : ` (×${fractionToText(multiplier)})`;

	return (
		<>
			{!!ingredients.length && (
				<Box justify="between" items="center" p="none" gap="md">
					<H4 className="color-gray-dark italic">
						<span className="font-medium">From sub-recipe</span>{' '}
						{recipe.get('title')}
						{multText}
					</H4>
				</Box>
			)}
			<RecipeIngredientsViewer
				recipe={recipe}
				multiplierOverride={multiplier}
			/>
		</>
	);
}
