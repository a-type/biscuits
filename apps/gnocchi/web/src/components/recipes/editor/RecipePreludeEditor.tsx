import { RichEditor } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { useSyncedPreludeEditor } from '../hooks.js';

export interface RecipePreludeEditor {
	recipe: Recipe;
}

export function RecipePreludeEditor({ recipe }: RecipePreludeEditor) {
	const editor = useSyncedPreludeEditor(recipe, false);
	return (
		<div>
			<RichEditor
				editor={editor}
				className="[&>.ProseMirror]:(bg-gray1 rounded-lg p-4 border-default)"
			/>
		</div>
	);
}
