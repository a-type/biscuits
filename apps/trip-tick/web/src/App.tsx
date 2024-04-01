import { Pages } from '@/pages/Pages.jsx';
import { clientDescriptor, hooks } from '@/store.js';
import { IconSpritesheet } from '@a-type/ui/components/icon';
import { TooltipProvider } from '@a-type/ui/components/tooltip';
import {
  useIsLoggedIn,
  Provider,
  createGraphQLClient,
  AppPreviewNotice,
} from '@biscuits/client';
import { ReactNode, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

const graphqlClient = createGraphQLClient();

export function App() {
  return (
    <Suspense>
      <Provider appId="trip-tick" graphqlClient={graphqlClient}>
        <LofiProvider>
          <TooltipProvider>
            <AppPreviewNotice />
            <Pages />
            <IconSpritesheet />
            <Toaster
              position="bottom-center"
              containerClassName="mb-10 sm:mb-0"
            />
          </TooltipProvider>
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
