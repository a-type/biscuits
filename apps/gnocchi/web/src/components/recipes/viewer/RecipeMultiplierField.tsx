import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@gnocchi.biscuits/verdant';
import { MultiplierStepper } from './MultiplierStepper.jsx';

export interface RecipeMultiplierFieldProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeMultiplierField({
  recipe,
  ...rest
}: RecipeMultiplierFieldProps) {
  const { multiplier } = hooks.useWatch(recipe);
  return (
    <MultiplierStepper
      value={multiplier}
      onChange={(val) => recipe.set('multiplier', val)}
      highlightChange
      {...rest}
    />
  );
}
