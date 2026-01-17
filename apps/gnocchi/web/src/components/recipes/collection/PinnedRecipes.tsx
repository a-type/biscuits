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
import { CollapsibleSimple, Divider, H2, Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import { RecipePinToggle } from '../viewer/RecipePinToggle.jsx';

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
		<CollapsibleSimple
			open={show}
			className={classNames('flex flex-col', className)}
		>
			<div className="flex flex-row items-center gap-2">
				<H2 className="mb-0">Pinned</H2>
				<HelpTip>
					Pins help you organize upcoming dishes. They expire after 3 weeks.
				</HelpTip>
			</div>
			<div className="flex flex-col gap-2">
				{pinnedRecipes.map((recipe) => (
					<PinnedRecipeListItem recipe={recipe} key={recipe.get('id')} />
				))}
			</div>
			<Divider className="my-4" />
		</CollapsibleSimple>
	);
}

function PinnedRecipeListItem({ recipe }: { recipe: Recipe }) {
	const { title } = hooks.useWatch(recipe);

	return (
		<div className="flex flex-row items-center gap-1 border rounded-lg border-solid px-3 py-2 border-gray">
			<RecipePinToggle recipe={recipe} />
			<Link
				to={makeRecipeLink(recipe, '')}
				className={classNames(
					'min-w-0 flex flex-1 flex-col gap-2px',
					title.length > 20 && 'text-sm',
				)}
			>
				<div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pl-2 text-md">
					{title}
				</div>
			</Link>
			<AddToListButton
				recipe={recipe}
				emphasis="ghost"
				className="flex-shrink-0"
			>
				<Icon name="add_to_list" />
			</AddToListButton>
			<RecipeListItemMenu recipe={recipe} className="flex-shrink-0" />
		</div>
	);
}
