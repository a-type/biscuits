import { RecipeNowPlayingLink } from '@/components/recipes/nowPlaying/RecipeNowPlayingLink.jsx';
import { useNowPlayingRecipes } from '@/components/recipes/nowPlaying/hooks.js';
import { Box, Button, Collapsible, Icon, Text } from '@a-type/ui';

export interface RecipesNowPlayingProps {
	showSingle?: boolean;
	defaultOpen?: boolean;
	slug?: string;
}

export function RecipesNowPlaying({
	showSingle,
	defaultOpen,
	slug,
}: RecipesNowPlayingProps) {
	const { firstRecipe, otherRecipes } = useNowPlayingRecipes();
	const activeRecipe = slug?.split('-').pop();

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
			border
			col
			items="start"
			overflow="hidden"
			elevated="lg"
			style={{ pointerEvents: 'auto' }}
		>
			<Collapsible defaultOpen={defaultOpen} className="w-full">
				<Collapsible.Trigger
					render={
						<Button
							emphasis="ghost"
							style={{
								width: '100%',
								justifyContent: 'space-between',
								borderRadius: 0,
							}}
						/>
					}
				>
					<Text italic emphasis="ambient">
						Now Cooking
					</Text>
					<Collapsible.Icon>
						<Icon name="chevron" style={{ transform: 'rotate(180deg)' }} />
					</Collapsible.Icon>
				</Collapsible.Trigger>
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
