import { HubRecipeData } from '@/types.js';
import { Box, H3, Note } from '@a-type/ui';
import { IngredientList, IngredientListItem } from './IngredientList.jsx';

export interface IngredientsProps {
	data: HubRecipeData;
}

export function Ingredients({ data }: IngredientsProps) {
	const embedded = Object.values(data.embeddedRecipes);
	return (
		<Box d="col" gap>
			<IngredientList>
				{data.ingredients.map((ingredient: any) => (
					<IngredientListItem key={ingredient.id}>
						<div itemProp="recipeIngredient" className="p-ingredient">
							{ingredient.text}
						</div>
						{ingredient.note && <Note className="ml-4">{ingredient.note}</Note>}
					</IngredientListItem>
				))}
			</IngredientList>
			{embedded.map((recipe) => (
				<Box d="col" gap>
					<H3>From sub-recipe: {recipe.title}</H3>
					<Ingredients data={recipe} />
				</Box>
			))}
		</Box>
	);
}
