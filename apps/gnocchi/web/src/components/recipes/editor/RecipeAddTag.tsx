import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogTitle,
	Icon,
} from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { ComponentPropsWithRef, ReactNode, Suspense, forwardRef } from 'react';
import { RecipeTagsFullEditor } from './RecipeTagsFullEditor.jsx';

export function RecipeEditTagsRoot(props: { children: ReactNode }) {
	return <Dialog {...props} />;
}

export function RecipeEditTagsTrigger(
	props: ComponentPropsWithRef<typeof Dialog.Trigger>,
) {
	return <Dialog.Trigger render={<DefaultTrigger />} {...props} />;
}

export function RecipeEditTagsContent({ recipe }: { recipe: Recipe }) {
	const { tags, title } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	return (
		<Dialog.Content>
			<Box col gap full="width">
				<DialogTitle>Tags for {title}</DialogTitle>
				<Suspense>
					<RecipeTagsFullEditor recipe={recipe} />
				</Suspense>
			</Box>
			<DialogActions>
				<DialogClose>Done</DialogClose>
			</DialogActions>
		</Dialog.Content>
	);
}

const DefaultTrigger = forwardRef<HTMLButtonElement, { className?: string }>(
	function DefaultTrigger({ className, ...rest }, ref) {
		return (
			<Button
				size="small"
				className={classNames('min-h-24px px-2 py-1 text-xs', className)}
				ref={ref}
				{...rest}
			>
				<Icon name="pencil" />
				<span>Tags</span>
			</Button>
		);
	},
);
