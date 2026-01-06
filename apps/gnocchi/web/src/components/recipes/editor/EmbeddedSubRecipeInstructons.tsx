import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	clsx,
	Collapsible,
	Icon,
	UseRenderRenderProp,
} from '@a-type/ui';
import { ReactNode, Suspense } from 'react';
import { RecipeInstructionsViewer } from '../viewer/RecipeInstructionsViewer.jsx';

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
						className={clsx('w-full gap-2 items-center text-start', className)}
						size="small"
						contentEditable={false}
					/>
				)
			}
		>
			<Icon
				name="chevron"
				className="[[data-state=open]>&]:rotate-180deg transition-all"
			/>
			<span className="italic">
				<span className="font-medium">Make</span> {recipe.get('title')}
			</span>
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
			<Box className="border-l border-l-gray border-l-solid pl-2 ml-4" p="none">
				<RecipeInstructionsViewer recipe={recipe} />
			</Box>
		</Collapsible.Content>
	);
}
