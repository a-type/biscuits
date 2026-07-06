import {
	Box,
	Peek,
	tipTapClassName,
	tipTapReadonlyClassName,
} from '@a-type/ui';
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
		<Box full="width">
			<Peek>
				<EditorContent
					editor={editor}
					readOnly
					className={classNames(tipTapClassName, tipTapReadonlyClassName)}
				/>
			</Peek>
		</Box>
	);
}
