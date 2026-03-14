import { Box, H3, Note } from '@a-type/ui';
import { FragmentOf, graphql, readFragment, ResultOf } from '@biscuits/graphql';
import {
	IngredientList,
	IngredientListHeading,
	IngredientListItem,
} from './IngredientList.jsx';

export const ingredientFragment = graphql(`
	fragment Ingredient on PublishedRecipeIngredient {
		id
		text
		note
		isSectionHeader
	}
`);

export const ingredientsFragment = graphql(
	`
		fragment Ingredients on PublishedRecipeData {
			ingredients {
				id
				...Ingredient
			}
			embeddedRecipes {
				id
				title
				ingredients {
					id
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

	const ingredients = data.ingredients.map((ingredient) =>
		readFragment(ingredientFragment, ingredient),
	);

	const groups = groupUnderHeadings(ingredients);
	console.log(ingredients, groups);

	return (
		<Box col gap>
			{groups.map((group, i) => (
				<IngredientList key={group.titleItem?.id ?? i}>
					{group.titleItem && (
						<IngredientListHeading>
							{group.titleItem.text}
						</IngredientListHeading>
					)}
					{group.items.map((ingredient: any) => (
						<IngredientListItem key={ingredient.id}>
							<div itemProp="recipeIngredient" className="p-ingredient">
								{ingredient.text}
							</div>
							{ingredient.note && (
								<Note className="ml-4">{ingredient.note}</Note>
							)}
						</IngredientListItem>
					))}
				</IngredientList>
			))}
			{embedded.map((recipe) => (
				<Box col gap key={recipe.id}>
					<H3>From sub-recipe: {recipe.title}</H3>
					<Ingredients data={recipe as any} />
				</Box>
			))}
		</Box>
	);
}

function groupUnderHeadings(
	ingredients: ResultOf<typeof ingredientFragment>[],
) {
	const groups: {
		titleItem: ResultOf<typeof ingredientFragment> | null;
		items: ResultOf<typeof ingredientFragment>[];
	}[] = [
		{
			titleItem: null,
			items: [],
		},
	];
	for (const ingredient of ingredients) {
		if (ingredient.isSectionHeader) {
			groups.push({
				titleItem: ingredient,
				items: [],
			});
		} else {
			groups[groups.length - 1].items.push(ingredient);
		}
	}
	return groups;
}
