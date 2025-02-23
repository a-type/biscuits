import { Peek, tipTapClassName, tipTapReadonlyClassName } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { EditorContent } from '@tiptap/react';
import classNames from 'classnames';
import { useSyncedPreludeEditor } from '../hooks.js';

export interface RecipePreludeViewerProps {
	recipe: Recipe;
}

export function RecipePreludeViewer({ recipe }: RecipePreludeViewerProps) {
	const editor = useSyncedPreludeEditor(recipe, true);

	return (
		<div className="w-full">
			<Peek>
				<EditorContent
					editor={editor}
					readOnly
					className={classNames(
						tipTapClassName,
						tipTapReadonlyClassName,
						'[&_.ProseMirror_h1]:text-lg',
						'[&_.ProseMirror_h2]:(text-lg font-light)',
						'[&_.ProseMirror_h3]:(text-md)',
					)}
				/>
			</Peek>
		</div>
	);
}
