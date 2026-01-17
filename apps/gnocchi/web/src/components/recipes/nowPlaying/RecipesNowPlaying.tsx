import { RecipeNowPlayingLink } from '@/components/recipes/nowPlaying/RecipeNowPlayingLink.jsx';
import { useNowPlayingRecipes } from '@/components/recipes/nowPlaying/hooks.js';
import {
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
	Icon,
} from '@a-type/ui';
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
		<div className="pointer-events-auto w-full flex flex-col items-start overflow-hidden border-default rounded-lg shadow-lg bg-white">
			<CollapsibleRoot defaultOpen={defaultOpen} className="w-full">
				<CollapsibleTrigger className="w-full flex flex-row items-center justify-between px-1 py-1 pr-5 bg-transparent">
					<span className="px-2 py-1 text-xs italic">Now Cooking</span>
					<Icon
						name="chevron"
						className="transition-transform duration-200 [[data-closed]_&]:rotate-180"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="flex flex-col gap-2">
						<RecipeNowPlayingLink recipe={firstRecipe} />
						{otherRecipes.map((recipe) => (
							<RecipeNowPlayingLink key={recipe.get('id')} recipe={recipe} />
						))}
					</div>
				</CollapsibleContent>
			</CollapsibleRoot>
		</div>
	);
}
