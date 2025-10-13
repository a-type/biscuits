import { HelpTip } from '@/components/promotional/HelpTip.jsx';
import { RecipeListItemMenu } from '@/components/recipes/collection/RecipeListItem.jsx';
import {
	usePinnedRecipes,
	useRecipeFoodFilter,
	useRecipeTagFilter,
	useRecipeTitleFilter,
} from '@/components/recipes/collection/hooks.js';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Box, CollapsibleSimple, Divider, H2, Icon, Text } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Link } from '@tanstack/react-router';
import classNames from 'classnames';
import { RecipePinToggle } from '../viewer/RecipePinToggle.jsx';
import cls from './PinnedRecipes.module.css';

export interface PinnedRecipesProps {
	className?: string;
}

export function PinnedRecipes({ className }: PinnedRecipesProps) {
	const pinnedRecipes = usePinnedRecipes();

	const [tagFilter] = useRecipeTagFilter();
	const [foodFilter] = useRecipeFoodFilter();
	const [titleFilter] = useRecipeTitleFilter();

	const show =
		!!pinnedRecipes.length && !(tagFilter || foodFilter || titleFilter);

	return (
		<CollapsibleSimple open={show} className={classNames(cls.root, className)}>
			<div className={cls.explainer}>
				<H2>Pinned</H2>
				<HelpTip>
					Pins help you organize upcoming dishes. They expire after 3 weeks.
				</HelpTip>
			</div>
			<Box col gap="sm">
				{pinnedRecipes.map((recipe) => (
					<PinnedRecipeListItem recipe={recipe} key={recipe.get('id')} />
				))}
			</Box>
			<Divider className={cls.divider} />
		</CollapsibleSimple>
	);
}

function PinnedRecipeListItem({ recipe }: { recipe: Recipe }) {
	const { title } = hooks.useWatch(recipe);

	return (
		<Box items="center" gap="xs" border round p="md" justify="between">
			<Box items="center" gap shrink>
				<RecipePinToggle recipe={recipe} />
				<Text
					truncate
					className={cls.title}
					render={<Link to={makeRecipeLink(recipe, '')} />}
				>
					{title}
				</Text>
			</Box>
			<Box items="center" gap>
				<AddToListButton
					recipe={recipe}
					emphasis="ghost"
					className={cls.noShrink}
				>
					<Icon name="add_to_list" />
				</AddToListButton>
				<RecipeListItemMenu recipe={recipe} className={cls.noShrink} />
			</Box>
		</Box>
	);
}
