import { hooks, groceriesDescriptor } from './index.js';
import { ReactNode } from 'react';
import { useCanSync } from '@biscuits/client';

export function Provider({ children }: { children: ReactNode }) {
  const isSubscribed = useCanSync();

  return (
    <hooks.Provider value={groceriesDescriptor} sync={isSubscribed}>
      {children}
    </hooks.Provider>
  );
}
