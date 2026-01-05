import { RecipeTagsList } from '@/components/recipes/collection/RecipeTagsList.jsx';
import { NewTagForm } from '@/components/recipes/editor/NewTagForm.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { ReactElement, Suspense, forwardRef, useState } from 'react';

export function RecipeEditTags({
	recipe,
	children,
	contentClassName,
	className,
	onClose,
}: {
	recipe: Recipe;
	children?: ReactElement;
	contentClassName?: string;
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
			<DialogContent className={contentClassName}>
				<DialogTitle>Tags for {title}</DialogTitle>
				<Suspense>
					<div className="mb-4 w-full">
						<RecipeTagsList
							onSelect={toggleTag}
							selectedValues={tags.getSnapshot()}
							className="w-full font-bold"
						/>
					</div>
					<NewTagForm onCreate={toggleTag} />
				</Suspense>
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
				className={classNames('py-1 px-2 text-xs min-h-24px', className)}
				ref={ref}
				{...rest}
			>
				<PlusIcon />
				<span>Tag</span>
			</Button>
		);
	},
);
