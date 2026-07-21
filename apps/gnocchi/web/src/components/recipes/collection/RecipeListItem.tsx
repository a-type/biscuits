import { Link } from '@/components/nav/Link.jsx';
import {
	RecipeEditTagsContent,
	RecipeEditTagsRoot,
	RecipeEditTagsTrigger,
} from '@/components/recipes/editor/RecipeAddTag.jsx';
import {
	makeRecipeLink,
	makeRecipeSlug,
} from '@/components/recipes/makeRecipeLink.js';
import { AddToListButton } from '@/components/recipes/viewer/AddToListButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { useDeleteRecipe } from '@/stores/groceries/mutations.js';
import {
	Box,
	Button,
	Card,
	CardRoot,
	CardTitle,
	Chip,
	clsx,
	DropdownMenu,
	DropdownMenuItemRightSlot,
	Icon,
	Text,
} from '@a-type/ui';
import { formatMinutes } from '@a-type/utils';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useNavigate } from '@tanstack/react-router';
import classNames from 'classnames';
import cuid from 'cuid';
import { memo, Suspense, useState } from 'react';
import { RECIPE_PINNED_CUTOFF } from '../constants.js';
import { RecipeMainImageViewer } from '../viewer/RecipeMainImageViewer.jsx';
import { RecipePinToggle } from '../viewer/RecipePinToggle.jsx';
import { RecipeTagsViewer } from '../viewer/RecipeTagsViewer.jsx';
import { useGridStyle } from './hooks.js';
import cls from './RecipeListItem.module.css';

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
			className={classNames(cls.root, className)}
			data-style={gridStyle}
			data-image={!!mainImage}
		>
			<Card.Main
				render={
					<Link
						to="/recipes/$slug"
						params={{
							slug: makeRecipeSlug(recipe),
						}}
						search={(prev) => prev}
					/>
				}
			>
				<CardTitle className={cls.title}>
					<Text truncate>{title}</Text>
				</CardTitle>
				<Box
					items="center"
					gap="sm"
					wrap
					className={clsx(
						cls.content,
						gridStyle === 'card-small' ? '@mode-denser' : '@mode-dense',
					)}
				>
					{!!totalTimeMinutes && (
						<Chip>
							<Icon name="clock" size={12} />
							{formatMinutes(totalTimeMinutes)}
						</Chip>
					)}
					<Suspense>
						<RecipeTagsViewer unwrapped recipe={recipe} max={3} />
					</Suspense>
				</Box>
			</Card.Main>
			<Card.Image>
				<RecipeMainImageViewer recipe={recipe} className={cls.full} />
			</Card.Image>
			<Card.Footer>
				<Card.Actions>
					<RecipePinToggle recipe={recipe} />

					<AddToListButton
						aria-label="Add recipe to groceries list"
						recipe={recipe}
						emphasis="ghost"
					>
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
		navigate({
			to: makeRecipeLink(copy, '/edit'),
		});
	};

	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<RecipeEditTagsRoot>
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
					render={
						<Button
							size="small"
							emphasis="ghost"
							aria-label="Show recipe menu"
							{...rest}
						/>
					}
				>
					<Icon name="dots" size={20} />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<RecipeEditTagsTrigger render={<DropdownMenu.Item />}>
						<span>Tags</span>
						<DropdownMenuItemRightSlot>
							<Icon name="tag" />
						</DropdownMenuItemRightSlot>
					</RecipeEditTagsTrigger>
					<DropdownMenu.Item
						render={
							<Link
								to="/recipes/$slug/edit"
								params={{
									slug: makeRecipeSlug(recipe),
								}}
							/>
						}
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
						className="@mode-attention"
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
			<RecipeEditTagsContent recipe={recipe} />
		</RecipeEditTagsRoot>
	);
}
