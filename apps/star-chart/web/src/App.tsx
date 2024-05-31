import { clientDescriptor, hooks } from '@/store.js';
import { ReactNode, Suspense, useLayoutEffect } from 'react';
import { Pages } from '@/pages/Pages.jsx';
import { useVisualViewportOffset } from '@a-type/ui/hooks';
import { Toaster } from 'react-hot-toast';
import { IconSpritesheet } from '@a-type/ui/components/icon';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { TooltipProvider } from '@a-type/ui/components/tooltip';
import { ParticleLayer } from '@a-type/ui/components/particles';
import { PrereleaseWarning, ReloadButton } from '@biscuits/client';
import { H1, P } from '@a-type/ui/components/typography';
import {
  useCanSync,
  Provider,
  createGraphQLClient,
  AppPreviewNotice,
} from '@biscuits/client';

export interface AppProps {}

const graphqlClient = createGraphQLClient();

export function App({}: AppProps) {
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = 'theme-lemon';
    }
  }, []);

  useVisualViewportOffset();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <TooltipProvider>
        <Suspense>
          <Provider
            appId="star-chart"
            graphqlClient={graphqlClient}
            storeDescriptor={clientDescriptor as any}
          >
            <VerdantProvider>
              <ParticleLayer>
                <AppPreviewNotice />
                <PrereleaseWarning />
                <Pages />
                <Toaster
                  position="bottom-center"
                  containerClassName="mb-10 sm:mb-0"
                />
                <IconSpritesheet />
              </ParticleLayer>
            </VerdantProvider>
          </Provider>
        </Suspense>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

function VerdantProvider({ children }: { children: ReactNode }) {
  // only sync if logged in to the server
  const isLoggedIn = useCanSync();
  return (
    <hooks.Provider value={clientDescriptor} sync={isLoggedIn}>
      {children}
    </hooks.Provider>
  );
}

function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-start justify-center gap-4 max-w-700px">
        <H1>Something went wrong</H1>
        <P>
          Sorry about this. The app has crashed. You can try refreshing, but if
          that doesn&apos;t work,{' '}
          <a className="underline font-bold" href="mailto:invalid">
            let me know about it.
          </a>
        </P>
        <ReloadButton />
      </div>
    </div>
  );
}
