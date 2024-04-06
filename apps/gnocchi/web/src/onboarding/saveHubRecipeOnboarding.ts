import { createOnboarding } from '@biscuits/client';

export const saveHubRecipeOnboarding = createOnboarding('saveHubRecipe', [
  'save',
  'recipe',
  'addToList',
  'viewList',
  'subscribe',
] as const);
