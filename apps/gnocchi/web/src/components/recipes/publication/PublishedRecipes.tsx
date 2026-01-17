import { hooks } from '@/stores/groceries/index.js';
import { Card } from '@a-type/ui';
import {
	FragmentOf,
	graphql,
	readFragment,
	useSuspenseQuery,
} from '@biscuits/graphql';
import { RecipeListItem } from '../collection/RecipeListItem.jsx';

const publishedRecipeCardFragment = graphql(`
	fragment PublishedRecipeCard on PublishedRecipe {
		id
		slug
		data {
			title
		}
	}
`);

const publishedRecipes = graphql(
	`
		query PublishedRecipes {
			recipePublication {
				id
				recipesConnection {
					edges {
						node {
							id
							...PublishedRecipeCard
						}
					}
				}
			}
		}
	`,
	[publishedRecipeCardFragment],
);

export interface PublishedRecipesProps {
	className?: string;
}

export function PublishedRecipes({ className }: PublishedRecipesProps) {
	const { data } = useSuspenseQuery(publishedRecipes);
	const recipes =
		data.recipePublication?.recipesConnection.edges.map((edge) => edge.node) ??
		[];

	return (
		<Card.Grid className={className}>
			{recipes.map((recipe) => (
				<PublishedRecipeCard key={recipe.id} recipe={recipe} />
			))}
		</Card.Grid>
	);
}

function PublishedRecipeCard({
	recipe: masked,
}: {
	recipe: FragmentOf<typeof publishedRecipeCardFragment>;
}) {
	const recipe = readFragment(publishedRecipeCardFragment, masked);
	const localRecipe = hooks.useOneRecipe({
		index: {
			where: 'slug',
			equals: recipe.slug,
		},
	});
	hooks.useWatch(localRecipe);

	if (localRecipe) {
		return <RecipeListItem recipe={localRecipe} />;
	}

	return null;
}
