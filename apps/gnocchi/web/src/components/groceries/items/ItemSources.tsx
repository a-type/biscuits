import { LinkButton } from '@/components/nav/Link.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { IngredientText } from '@/components/recipes/viewer/IngredientText.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
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
import { Suspense } from 'react';
import cls from './ItemSources.module.css';

export interface ItemSourcesProps {
	item: Item;
}

export function ItemSources({ item, ...rest }: ItemSourcesProps) {
	hooks.useWatch(item.get('inputs'));
	return (
		<div className={cls.root} {...rest}>
			<label className={cls.label}>Sources:</label>
			<ul className={cls.items} {...rest}>
				{item.get('inputs').map((input) => (
					<li className={cls.item} key={(input as any).oid}>
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
				className={cls.link}
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
	multiplier,
	highlightIngredient,
}: {
	recipeId: string;
	multiplier?: number | null;
	highlightIngredient?: string;
}) {
	const recipe = hooks.useRecipe(recipeId);
	hooks.useWatch(recipe);
	return (
		<Dialog>
			<DialogTrigger render={<span className={cls.link} />}>
				{recipe ? truncate(recipe.get('title')) : 'a recipe'}
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
					<DialogClose render={<Button style={{ alignSelf: 'end' }} />}>
						Close
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
		<Box col gap="sm">
			<H2>{title}</H2>
			<LinkButton emphasis="primary" align="start" to={makeRecipeLink(recipe)}>
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
						style={{
							fontWeight:
								ingredient.get('text') === highlightIngredient
									? 'bold'
									: 'normal',
						}}
					>
						<IngredientText ingredient={ingredient} multiplier={multiplier} />
					</li>
				))}
			</ul>
		</Box>
	);
}
