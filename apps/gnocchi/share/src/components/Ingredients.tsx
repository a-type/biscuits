import { Box, H3, Note } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { IngredientList, IngredientListItem } from './IngredientList.jsx';

export const ingredientFragment = graphql(`
	fragment Ingredient on PublishedRecipeIngredient {
		id
		text
		note
	}
`);

export const ingredientsFragment = graphql(
	`
		fragment Ingredients on PublishedRecipeData {
			ingredients {
				...Ingredient
			}
			embeddedRecipes {
				id
				title
				ingredients {
					...Ingredient
				}
			}
		}
	`,
	[ingredientFragment],
);

export interface IngredientsProps {
	data: FragmentOf<typeof ingredientsFragment>;
}

export function Ingredients({ data: dataMasked }: IngredientsProps) {
	const data = readFragment(ingredientsFragment, dataMasked);
	const embedded = data.embeddedRecipes;
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
				<Box d="col" gap key={recipe.id}>
					<H3>From sub-recipe: {recipe.title}</H3>
					<Ingredients data={recipe as any} />
				</Box>
			))}
		</Box>
	);
}
