import { RecipeTagsList } from '@/components/recipes/collection/RecipeTagsList.jsx';
import { NewTagForm } from '@/components/recipes/editor/NewTagForm.jsx';
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
	const toggleTag = (tagName: string | null) => {
		if (tagName === null) return;
		const tags = recipe.get('tags');
		if (tags.has(tagName)) {
			tags.removeAll(tagName);
		} else {
			tags.add(tagName);
		}
	};
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
						<RecipeTagsList
							onSelect={toggleTag}
							selectedValues={tags.getSnapshot()}
							className="w-full font-bold"
						/>
						<NewTagForm onCreate={toggleTag} />
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
				<Icon name="plus" />
				<span>Tag</span>
			</Button>
		);
	},
);
