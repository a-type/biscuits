import { clsx, tipTapClassName } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { EditorContent } from '@tiptap/react';
import { useSyncedPreludeEditor } from '../hooks.js';

export interface RecipePreludeEditor {
	recipe: Recipe;
}

export function RecipePreludeEditor({ recipe }: RecipePreludeEditor) {
	const editor = useSyncedPreludeEditor(recipe, false);
	return (
		<div>
			<EditorContent
				editor={editor}
				className={clsx(tipTapClassName, '[&_a]:font-bold')}
			/>
		</div>
	);
}
