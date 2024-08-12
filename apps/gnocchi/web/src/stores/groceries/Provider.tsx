import { hooks, groceriesDescriptor } from './index.js';
import { ReactNode } from 'react';
import { useHasServerAccess } from '@biscuits/client';

export function Provider({ children }: { children: ReactNode }) {
  const isSubscribed = useHasServerAccess();

  return (
    <hooks.Provider value={groceriesDescriptor} sync={isSubscribed}>
      {children}
    </hooks.Provider>
  );
}
