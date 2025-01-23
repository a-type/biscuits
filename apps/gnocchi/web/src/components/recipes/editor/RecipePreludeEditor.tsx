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
				className="[&>.ProseMirror]:(bg-white rounded-[20px] p-4 border-1 border-gray-5 border-solid shadow-sm-inset)"
			/>
		</div>
	);
}
