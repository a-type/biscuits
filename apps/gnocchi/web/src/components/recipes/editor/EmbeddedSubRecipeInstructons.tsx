import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	clsx,
	Collapsible,
	Icon,
	Text,
	UseRenderRenderProp,
} from '@a-type/ui';
import { ReactNode, Suspense } from 'react';
import { RecipeInstructionsViewer } from '../viewer/RecipeInstructionsViewer.jsx';
import cls from './EmbeddedSubInstructions.module.css';

export function EmbeddedSubRecipeInstructionsWrapper({
	children,
	render,
}: {
	children: ReactNode;
	render?: UseRenderRenderProp;
}) {
	return (
		<Collapsible render={render}>
			<Suspense>{children}</Suspense>
		</Collapsible>
	);
}

export function EmbeddedSubRecipeInstructionsToggle({
	recipeId,
	className,
	render,
}: {
	recipeId: string;
	className?: string;
	render?: UseRenderRenderProp;
}) {
	const recipe = hooks.useRecipe(recipeId);
	hooks.useWatch(recipe);

	if (!recipe) {
		return <div>Error: sub-recipe not found</div>;
	}

	return (
		<Collapsible.Trigger
			render={
				render || (
					<Button
						emphasis="ghost"
						className={clsx('w-full', className)}
						size="small"
						contentEditable={false}
					/>
				)
			}
		>
			<Collapsible.Icon>
				<Icon name="chevron" />
			</Collapsible.Icon>
			<Text italic>
				<Text bold>Make</Text> {recipe.get('title')}
			</Text>
		</Collapsible.Trigger>
	);
}

export function EmbeddedSubRecipeContent({
	recipeId,
	className,
}: {
	recipeId: string;
	className?: string;
}) {
	const recipe = hooks.useRecipe(recipeId);
	hooks.useWatch(recipe);

	if (!recipe) {
		return null;
	}

	return (
		<Collapsible.Content contentEditable={false} className={className}>
			<Box className={cls.nested} p="none">
				<RecipeInstructionsViewer recipe={recipe} />
			</Box>
		</Collapsible.Content>
	);
}
