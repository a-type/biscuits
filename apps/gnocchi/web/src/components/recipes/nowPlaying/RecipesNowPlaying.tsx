import { RecipeNowPlayingLink } from '@/components/recipes/nowPlaying/RecipeNowPlayingLink.jsx';
import { useNowPlayingRecipes } from '@/components/recipes/nowPlaying/hooks.js';
import { Box, Button, Collapsible, Icon, Text } from '@a-type/ui';
import { useParams } from '@verdant-web/react-router';

export interface RecipesNowPlayingProps {
	showSingle?: boolean;
	defaultOpen?: boolean;
}

export function RecipesNowPlaying({
	showSingle,
	defaultOpen,
}: RecipesNowPlayingProps) {
	const { firstRecipe, otherRecipes } = useNowPlayingRecipes();
	const activeRecipe = useParams().slug?.split('-').pop();

	if (!firstRecipe) {
		return null;
	}
	if (
		!showSingle &&
		otherRecipes.length === 0 &&
		firstRecipe.get('slug') === activeRecipe
	) {
		return null;
	}

	return (
		<Box
			surface="ambient"
			full="width"
			col
			items="start"
			overflow="hidden"
			elevated="lg"
			style={{ pointerEvents: 'auto' }}
		>
			<Collapsible defaultOpen={defaultOpen} className="w-full">
				<Button
					emphasis="unstyled"
					style={{ width: '100%', justifyContent: 'space-between' }}
				>
					<Text italic emphasis="ambient">
						Now Cooking
					</Text>
					<Collapsible.Icon>
						<Icon name="chevron" />
					</Collapsible.Icon>
				</Button>
				<Collapsible.Content>
					<Box col gap="sm">
						<RecipeNowPlayingLink recipe={firstRecipe} />
						{otherRecipes.map((recipe) => (
							<RecipeNowPlayingLink key={recipe.get('id')} recipe={recipe} />
						))}
					</Box>
				</Collapsible.Content>
			</Collapsible>
		</Box>
	);
}
