import { recipeTagEditorState } from '@/components/recipes/tags/recipeTagEditorState.js';
import { hooks } from '@/stores/groceries/index.js';
import { Box, Dialog } from '@a-type/ui';
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
			<Dialog.Content>
				<Dialog.Title>Edit {tag?.get('name')}</Dialog.Title>
				<Box gap="sm">
					<div>Color:</div>
					<ColorPicker
						onValueChange={(color) => tag?.set('color', color)}
						value={tag?.get('color') ?? null}
					/>
				</Box>

				<Dialog.Actions>
					<Dialog.Close>Done</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
