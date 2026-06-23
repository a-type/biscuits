import { recipeTagEditorState } from '@/components/recipes/tags/recipeTagEditorState.js';
import { hooks } from '@/stores/groceries/index.js';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@a-type/ui';
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
				<div className="flex flex-row gap-3">
					<div>Color:</div>
					{/* TODO: color picker */}
					{/* <ColorPicker
						onChange={(color) => tag?.set('color', color)}
						value={tag?.get('color') as PaletteName | null}
					/> */}
				</div>

				<DialogActions>
					<DialogClose>Done</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
