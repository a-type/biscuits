import { createOnboarding } from '@biscuits/client';

export const basicsOnboarding = createOnboarding(
	'basics',
	['intro', 'bubbles', 'color', 'palette'],
	true,
);
