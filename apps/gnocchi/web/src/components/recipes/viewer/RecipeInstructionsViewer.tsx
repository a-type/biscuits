import { tipTapClassName, tipTapReadonlyClassName } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { EditorContent } from '@tiptap/react';
import classNames from 'classnames';
import { useSyncedInstructionsEditor } from '../hooks.js';

export interface RecipeInstructionsViewerProps {
	recipe: Recipe;
	className?: string;
}

export function RecipeInstructionsViewer({
	recipe,
	className,
}: RecipeInstructionsViewerProps) {
	const editor = useSyncedInstructionsEditor({ recipe, readonly: true });
	return (
		<EditorContent
			className={classNames(
				tipTapClassName,
				tipTapReadonlyClassName,
				'w-full p-0',
				'[&_.ProseMirror]:(p-0)',
				className,
			)}
			editor={editor}
			readOnly
		/>
	);
}
