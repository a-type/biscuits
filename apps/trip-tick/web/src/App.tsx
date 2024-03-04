import { Pages } from '@/pages/Pages.jsx';
import { clientDescriptor, hooks } from '@/store.js';
import { IconSpritesheet } from '@a-type/ui/components/icon';
import { useIsLoggedIn, Provider, createGraphQLClient } from '@biscuits/client';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

const graphqlClient = createGraphQLClient();

export function App() {
  return (
    <Suspense>
      <Provider value={graphqlClient}>
        <LofiProvider>
          <Pages />
          <IconSpritesheet />
          <Toaster
            position="bottom-center"
            containerClassName="mb-10 sm:mb-0"
          />
        </LofiProvider>
      </Provider>
    </Suspense>
  );
}

function LofiProvider({ children }: { children: ReactNode }) {
  // only sync if logged in to the server
  const isLoggedIn = useIsLoggedIn();
  return (
    <hooks.Provider value={clientDescriptor} sync={isLoggedIn}>
      {children}
    </hooks.Provider>
  );
}
