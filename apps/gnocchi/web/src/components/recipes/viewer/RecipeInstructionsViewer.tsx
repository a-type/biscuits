import { Recipe } from '@gnocchi.biscuits/verdant';
import { useSyncedInstructionsEditor } from '../hooks.js';
import { RichEditor } from '@a-type/ui/components/richEditor';
import classNames from 'classnames';

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
