import { Pages } from '@/pages/Pages.jsx';
import { clientDescriptor, hooks } from '@/store.js';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { Provider as UIProvider } from '@a-type/ui/components/provider';
import { H1, P } from '@a-type/ui/components/typography';
import { Provider, ReloadButton, useHasServerAccess } from '@biscuits/client';
import { ReactNode, Suspense } from 'react';
import { ProjectSettingsDialog } from './components/project/ProjectSettingsDialog.jsx';

export interface AppProps {}

export function App({}: AppProps) {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <UIProvider>
        <Suspense>
          <Provider
            appId="star-chart"
            storeDescriptor={clientDescriptor as any}
          >
            <VerdantProvider>
              <Pages />
              <ProjectSettingsDialog />
            </VerdantProvider>
          </Provider>
        </Suspense>
      </UIProvider>
    </ErrorBoundary>
  );
}

function VerdantProvider({ children }: { children: ReactNode }) {
  // only sync if logged in to the server
  const isLoggedIn = useHasServerAccess();
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
