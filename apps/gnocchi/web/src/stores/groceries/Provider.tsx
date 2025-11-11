import { useHasServerAccess } from '@biscuits/client';
import { ReactNode } from 'react';
import { hooks, verdant } from './index.js';

export function Provider({ children }: { children: ReactNode }) {
	const isSubscribed = useHasServerAccess();

	return (
		<hooks.Provider value={verdant} sync={isSubscribed}>
			{children}
		</hooks.Provider>
	);
}
