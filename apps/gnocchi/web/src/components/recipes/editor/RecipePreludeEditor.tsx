import { clsx, Input, tipTapClassName } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { EditorContent } from '@tiptap/react';
import { useSyncedPreludeEditor } from '../hooks.js';
import cls from './RecipePreludeEditor.module.css';

export interface RecipePreludeEditor {
	recipe: Recipe;
	className?: string;
}

export function RecipePreludeEditor({
	recipe,
	className,
}: RecipePreludeEditor) {
	const editor = useSyncedPreludeEditor(recipe, false);
	return (
		<Input.Border className={clsx(cls.root, className)}>
			<EditorContent
				editor={editor}
				className={clsx(tipTapClassName, cls.editor)}
			/>
		</Input.Border>
	);
}
