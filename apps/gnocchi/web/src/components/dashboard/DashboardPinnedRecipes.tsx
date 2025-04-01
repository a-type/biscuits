import { hooks } from '@/stores/groceries/index.js';
import { Card, Chip, clsx, H4, Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { usePinnedRecipes } from '../recipes/collection/hooks.js';
import { RecipeMainImageViewer } from '../recipes/viewer/RecipeMainImageViewer.jsx';
import { RecipeTagsViewer } from '../recipes/viewer/RecipeTagsViewer.jsx';
import { CardContent, DashboardContent } from './common.js';

export interface DashboardPinnedRecipesProps {
	className?: string;
}

export function DashboardPinnedRecipes({
	className,
}: DashboardPinnedRecipesProps) {
	const pinnedRecipes = usePinnedRecipes();

	if (!pinnedRecipes.length) return null;

	const small = pinnedRecipes.length > 3;

	return (
		<DashboardContent className={className}>
			<H4>Pinned recipes</H4>
			<Card.Grid columns={Math.floor(pinnedRecipes.length / 4) + 1}>
				{pinnedRecipes.map((recipe) => (
					<PinnedRecipeCard key={recipe.uid} recipe={recipe} small={small} />
				))}
			</Card.Grid>
		</DashboardContent>
	);
}

function PinnedRecipeCard({
	recipe,
	small,
}: {
	recipe: Recipe;
	small?: boolean;
}) {
	const { title, mainImage, totalTimeMinutes } = hooks.useWatch(recipe);

	return (
		<Card className={clsx(!!mainImage && !small && 'h-20dvh max-h-200px')}>
			<Card.Main compact>
				<Card.Title
					className={clsx(
						'text-ellipsis overflow-hidden',
						!small && 'text-nowrap',
					)}
				>
					{title}
				</Card.Title>
				<CardContent>
					{totalTimeMinutes && (
						<Chip>
							<Icon name="clock" />
							{totalTimeMinutes} min
						</Chip>
					)}
					{!small && (
						<RecipeTagsViewer unwrapped recipe={recipe} className="text-xs" />
					)}
				</CardContent>
			</Card.Main>
			<Card.Image>
				<RecipeMainImageViewer recipe={recipe} className="w-full h-full" />
			</Card.Image>
		</Card>
	);
}
