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
				'w-full',
				tipTapClassName,
				tipTapReadonlyClassName,
				className,
			)}
			editor={editor}
			readOnly
		/>
	);
}
