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
import { Button, CollapsibleSimple, Divider, H2, Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';
import { addWeeks } from 'date-fns/addWeeks';
import { PinIcon } from './PinIcon.jsx';

export interface PinnedRecipesProps {
	className?: string;
}

export const THREE_WEEKS_AGO = addWeeks(Date.now(), -3).getTime();

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
			<div className="flex flex-row gap-2 items-center">
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
		<div className="flex flex-row items-center gap-1 border border-solid border-gray rounded-lg px-3 py-2">
			<Button emphasis="primary" onClick={() => recipe.set('pinnedAt', null)}>
				<PinIcon isPinned />
			</Button>
			<Link
				to={makeRecipeLink(recipe, '')}
				className={classNames(
					'flex-1 flex flex-col gap-2px min-w-0',
					title.length > 20 && 'text-sm',
				)}
			>
				<div className="pl-2 text-md overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
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
