import { Pages } from '@/pages/Pages.jsx';
import { clientDescriptor, hooks } from '@/store.js';
import { Provider as UIProvider } from '@a-type/ui/components/provider';
import { FullScreenSpinner } from '@a-type/ui/components/spinner';
import { Provider, useCanSync } from '@biscuits/client';
import { ReactNode, Suspense } from 'react';
import { Explainer } from './components/onboarding/Explainer.jsx';

export function App() {
  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <Suspense fallback={<FullScreenSpinner />}>
        <UIProvider>
          <Provider appId="trip-tick" storeDescriptor={clientDescriptor as any}>
            <LofiProvider>
              <Pages />
              <Explainer />
            </LofiProvider>
          </Provider>
        </UIProvider>
      </Suspense>
    </div>
  );
}

function LofiProvider({ children }: { children: ReactNode }) {
  // only sync if logged in to the server
  const isLoggedIn = useCanSync();
  return (
    <hooks.Provider value={clientDescriptor} sync={isLoggedIn}>
      {children}
    </hooks.Provider>
  );
}
