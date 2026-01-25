import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	Icon,
} from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import classNames from 'classnames';
import { ReactElement, Suspense, forwardRef, useState } from 'react';
import { RecipeTagsFullEditor } from './RecipeTagsFullEditor.jsx';

export function RecipeEditTags({
	recipe,
	children,
	className,
	onClose,
}: {
	recipe: Recipe;
	children?: ReactElement;
	className?: string;
	onClose?: () => void;
}) {
	const [open, setOpen] = useState(false);
	const { tags, title } = hooks.useWatch(recipe);
	hooks.useWatch(tags);

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
				if (!o && onClose) onClose();
			}}
		>
			{children ? (
				<Dialog.Trigger render={children} />
			) : (
				<Dialog.Trigger render={<DefaultTrigger />} className={className} />
			)}
			<DialogContent>
				<Box col gap full="width">
					<DialogTitle>Tags for {title}</DialogTitle>
					<Suspense>
						<RecipeTagsFullEditor recipe={recipe} />
					</Suspense>
				</Box>
				<DialogActions>
					<DialogClose>Done</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
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
