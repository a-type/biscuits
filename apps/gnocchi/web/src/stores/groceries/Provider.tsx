import { useHasServerAccess } from '@biscuits/client';
import { ReactNode } from 'react';
import { groceriesDescriptor, hooks } from './index.js';

export function Provider({ children }: { children: ReactNode }) {
	const isSubscribed = useHasServerAccess();

	return (
		<hooks.Provider value={groceriesDescriptor} sync={isSubscribed}>
			{children}
		</hooks.Provider>
	);
}
