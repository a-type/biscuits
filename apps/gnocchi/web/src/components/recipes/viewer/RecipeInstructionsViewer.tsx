import { RichEditor } from '@a-type/ui';
import { Recipe } from '@gnocchi.biscuits/verdant';
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
		<RichEditor
			className={classNames('w-full', className)}
			editor={editor}
			readOnly
		/>
	);
}
