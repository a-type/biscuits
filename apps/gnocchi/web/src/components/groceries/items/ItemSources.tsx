import { LinkButton } from '@/components/nav/Link.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { IngredientText } from '@/components/recipes/viewer/IngredientText.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	H2,
	H3,
	P,
} from '@a-type/ui';
import { fractionToText } from '@a-type/utils';
import { Item, ItemInputsItem } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { Suspense } from 'react';

export interface ItemSourcesProps {
	item: Item;
}

export function ItemSources({ item, ...rest }: ItemSourcesProps) {
	hooks.useWatch(item.get('inputs'));
	return (
		<div className="mr-auto mt-2 mb-0 text-xs leading-tight min-w-0" {...rest}>
			<label className="italic inline mr-2">Sources:</label>
			<ul
				className="color-gray7 list-none p-0 m-0 max-w-full overflow-hidden inline-flex flex-col"
				{...rest}
			>
				{item.get('inputs').map((input) => (
					<li
						className="color-inherit text-inherit inline text-ellipsis max-w-full after:[&:not(:last-child)]:content-[',_']"
						key={(input as any).oid}
					>
						<InputRenderer input={input} />
					</li>
				))}
			</ul>
		</div>
	);
}

function InputRenderer({ input }: { input: ItemInputsItem }) {
	const { url, recipeId, multiplier, title, text } = hooks.useWatch(input);
	if (recipeId) {
		return (
			<span>
				{text}
				{multiplier !== 1 && multiplier !== null
					? ` (x${multiplier})`
					: ''}{' '}
				(from{' '}
				<RecipePreview
					recipeId={recipeId}
					title={title}
					multiplier={multiplier}
					highlightIngredient={text}
				/>
				)
			</span>
		);
	}
	if (url) {
		return (
			<a
				href={url}
				className="font-bold"
				rel="noopener noreferrer"
				target="_blank"
			>
				{title || 'A website'}
			</a>
		);
	}
	if (title) {
		return <span>{truncate(title)}</span>;
	}
	return <span>Added "{text}"</span>;
}

function truncate(str: string, max = 20) {
	if (str.length > max) {
		return str.slice(0, max) + '…';
	}
	return str;
}

function RecipePreview({
	recipeId,
	title,
	multiplier,
	highlightIngredient,
}: {
	recipeId: string;
	title?: string | null;
	multiplier?: number | null;
	highlightIngredient?: string;
}) {
	const recipe = hooks.useRecipe(recipeId);
	hooks.useWatch(recipe);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<span className="font-bold">
					{recipe ? truncate(recipe.get('title')) : 'a recipe'}
				</span>
			</DialogTrigger>
			<DialogContent>
				<Suspense>
					<RecipePreviewContent
						recipeId={recipeId}
						multiplier={multiplier || undefined}
						highlightIngredient={highlightIngredient}
					/>
				</Suspense>
				<DialogActions>
					<DialogClose asChild>
						<Button align="end">Close</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function RecipePreviewContent({
	recipeId,
	multiplier = 1,
	highlightIngredient,
}: {
	recipeId: string;
	multiplier?: number;
	highlightIngredient?: string;
}) {
	const recipe = hooks.useRecipe(recipeId);
	const live = hooks.useWatch(recipe);

	if (!live || !recipe) {
		return (
			<div>
				<H2>Recipe not found</H2>
				<P>It may have been deleted.</P>
			</div>
		);
	}

	const { title, ingredients } = live;

	return (
		<div className="flex flex-col gap-3">
			<H2>{title}</H2>
			<LinkButton color="primary" align="start" to={makeRecipeLink(recipe)}>
				View recipe
			</LinkButton>
			<H3>Ingredients</H3>
			{multiplier !== 1 && multiplier !== null && (
				<span>(with {fractionToText(multiplier)} multiplication applied)</span>
			)}
			<ul>
				{ingredients.map((ingredient) => (
					<li
						key={ingredient.get('id')}
						className={classNames({
							'font-bold': ingredient.get('text') === highlightIngredient,
						})}
					>
						<IngredientText ingredient={ingredient} multiplier={multiplier} />
					</li>
				))}
			</ul>
		</div>
	);
}
