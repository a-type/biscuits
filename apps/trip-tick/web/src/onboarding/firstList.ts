import { createOnboarding } from '@biscuits/client';

export const firstList = createOnboarding(
  'firstList',
  ['addItem', 'conditions'] as const,
  true,
);
