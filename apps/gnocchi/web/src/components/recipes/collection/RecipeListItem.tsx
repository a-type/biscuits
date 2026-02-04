import { Link } from '@/components/nav/Link.jsx';
import { RecipeEditTags } from '@/components/recipes/editor/RecipeAddTag.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { useDeleteRecipe } from '@/stores/groceries/mutations.js';
import {
	Button,
	Card,
	CardRoot,
	CardTitle,
	Chip,
	clsx,
	DropdownMenu,
	DropdownMenuItemRightSlot,
	Icon,
} from '@a-type/ui';
import { formatMinutes } from '@a-type/utils';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useNavigate } from '@verdant-web/react-router';
import classNames from 'classnames';
import cuid from 'cuid';
import { memo, Suspense, useState } from 'react';
import { RECIPE_PINNED_CUTOFF } from '../constants.js';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import { RecipePinToggle } from '../viewer/RecipePinToggle.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import { useGridStyle } from './hooks.js';

export const RecipeListItem = memo(function RecipeListItem({
	recipe,
	className,
}: {
	recipe: Recipe;
	className?: string;
}) {
	const { title, mainImage, totalTimeMinutes } = hooks.useWatch(recipe);
	const [gridStyle] = useGridStyle();

	return (
		<Card
			className={classNames(
				'self-end',
				{
					'!max-h-20dvh': gridStyle === 'card-small',
					'min-h-200px md:(h-30dvh max-h-300px)': !!mainImage,
				},
				'shadow-sm',
				className,
			)}
		>
			<Card.Main render={<Link to={makeRecipeLink(recipe)} preserveQuery />}>
				<CardTitle
					className={classNames(
						'flex-shrink-0',
						gridStyle === 'card-small' ? 'text-sm sm:text-md' : '',
					)}
				>
					<span className="line-clamp-2 text-ellipsis">{title}</span>
				</CardTitle>
				<div
					className={clsx(
						'm-2 flex flex-row flex-wrap gap-sm',
						gridStyle === 'card-small' ? 'text-xxs' : 'text-xs',
					)}
				>
					{!!totalTimeMinutes && (
						<Chip className="bg-wash">
							<Icon name="clock" />
							{formatMinutes(totalTimeMinutes)}
						</Chip>
					)}
					<Suspense>
						<RecipeTagsViewer unwrapped recipe={recipe} max={3} />
					</Suspense>
				</div>
			</Card.Main>
			<Card.Image>
				<RecipeMainImageViewer recipe={recipe} className="h-full w-full" />
			</Card.Image>
			<Card.Footer>
				<Card.Actions>
					<RecipePinToggle recipe={recipe} />

					<AddToListButton recipe={recipe} emphasis="ghost">
						<Icon name="add_to_list" />
					</AddToListButton>
				</Card.Actions>
				<Card.Menu>
					<RecipeListItemMenu recipe={recipe} />
				</Card.Menu>
			</Card.Footer>
		</Card>
	);
});

export function RecipePlaceholderItem({ className }: { className?: string }) {
	return <CardRoot className={className}>&nbsp;</CardRoot>;
}

export function RecipeListItemMenu({
	recipe,
	...rest
}: {
	recipe: Recipe;
	className?: string;
}) {
	const deleteRecipe = useDeleteRecipe();
	const { pinnedAt } = hooks.useWatch(recipe);
	const isPinned = pinnedAt && pinnedAt > RECIPE_PINNED_CUTOFF;
	const client = hooks.useClient();
	const navigate = useNavigate();
	const copyRecipe = async () => {
		const copy = await client.recipes.clone(recipe);
		copy.update({
			slug: cuid.slug(),
			title: `${recipe.get('title')} (copy)`,
			pinnedAt: null,
			createdAt: Date.now(),
			addIntervalGuess: null,
			cookCount: 0,
			lastAddedAt: null,
			lastCookedAt: null,
			session: null,
			updatedAt: Date.now(),
		});
		navigate(makeRecipeLink(copy, '/edit'), {
			skipTransition: true,
		});
	};

	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<DropdownMenu
			open={menuOpen}
			onOpenChange={(open, ev) => {
				if (open) setMenuOpen(true);
				if (!open && ev.reason === 'outside-press') {
					setMenuOpen(false);
				}
			}}
			modal={false}
		>
			<DropdownMenu.Trigger
				render={<Button size="small" emphasis="ghost" {...rest} />}
			>
				<Icon name="dots" className="h-20px w-20px" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<RecipeEditTags recipe={recipe} onClose={() => setMenuOpen(false)}>
					<DropdownMenu.Item>
						<span>Tags</span>
						<DropdownMenuItemRightSlot>
							<Icon name="tag" />
						</DropdownMenuItemRightSlot>
					</DropdownMenu.Item>
				</RecipeEditTags>
				<DropdownMenu.Item
					render={<Link to={makeRecipeLink(recipe, '/edit')} preserveQuery />}
				>
					<span>Edit</span>
					<DropdownMenuItemRightSlot>
						<Icon name="pencil" />
					</DropdownMenuItemRightSlot>
				</DropdownMenu.Item>
				{isPinned && (
					<DropdownMenu.Item
						onClick={() => {
							recipe.set('pinnedAt', null);
							setMenuOpen(false);
						}}
					>
						<span>Remove pin</span>
						<DropdownMenuItemRightSlot>
							<Icon name="pinFilled" />
						</DropdownMenuItemRightSlot>
					</DropdownMenu.Item>
				)}
				<DropdownMenu.Item onClick={copyRecipe}>
					<span>Make a copy</span>
					<DropdownMenuItemRightSlot>
						<Icon name="copy" />
					</DropdownMenuItemRightSlot>
				</DropdownMenu.Item>
				<DropdownMenu.Item
					color="attention"
					onClick={() => {
						deleteRecipe(recipe.get('id'));
						setMenuOpen(false);
					}}
				>
					<span>Delete</span>
					<DropdownMenuItemRightSlot>
						<Icon name="trash" />
					</DropdownMenuItemRightSlot>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu>
	);
}
