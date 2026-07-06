import { recipeTagEditorState } from '@/components/recipes/tags/recipeTagEditorState.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@a-type/ui';
import { ColorPicker } from '@biscuits/client';
import { useSnapshot } from 'valtio';

export interface RecipeTagEditorProps {}

export function RecipeTagEditor() {
	const editingTag = useSnapshot(recipeTagEditorState).editingTag;
	const tag = hooks.useRecipeTagMetadata(editingTag || '', {
		skip: !editingTag,
	});
	hooks.useWatch(tag);

	return (
		<Dialog
			open={!!editingTag}
			onOpenChange={(open) => {
				if (!open) {
					recipeTagEditorState.editingTag = null;
				}
			}}
		>
			<DialogContent>
				<DialogTitle>Edit {tag?.get('name')}</DialogTitle>
				<Box gap="sm">
					<div>Color:</div>
					<ColorPicker
						onValueChange={(color) => tag?.set('color', color)}
						value={tag?.get('color') ?? null}
					/>
				</Box>

				<DialogActions>
					<DialogClose>Done</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
