import { hooks } from '@/stores/groceries/index.js';
import { Box, Button, Chip, clsx, Dialog, Icon } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { ComponentPropsWithRef, forwardRef, ReactNode, Suspense } from 'react';
import { RecipeTagsFullEditor } from './RecipeTagsFullEditor.jsx';

export function RecipeEditTagsRoot(props: { children: ReactNode }) {
	return <Dialog {...props} />;
}

export function RecipeEditTagsTrigger(
	props: ComponentPropsWithRef<typeof Dialog.Trigger>,
) {
	return <Dialog.Trigger render={<DefaultTrigger />} {...props} />;
}

export function RecipeEditTagsContent({
	recipe,
	className,
}: {
	recipe: Recipe;
	className?: string;
}) {
	const { tags, title } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	return (
		<Dialog.Content className={className}>
			<Box col gap full="width">
				<Dialog.Title>Tags for {title}</Dialog.Title>
				<Suspense>
					<RecipeTagsFullEditor recipe={recipe} />
				</Suspense>
			</Box>
			<Dialog.Actions>
				<Dialog.Close>Done</Dialog.Close>
			</Dialog.Actions>
		</Dialog.Content>
	);
}

const DefaultTrigger = forwardRef<HTMLButtonElement, { className?: string }>(
	function DefaultTrigger({ className, ...rest }, ref) {
		return (
			<Button
				className={clsx('@mode-denser', className)}
				render={<Chip />}
				ref={ref}
				{...rest}
			>
				<Icon name="pencil" />
				<span>Tags</span>
			</Button>
		);
	},
);
