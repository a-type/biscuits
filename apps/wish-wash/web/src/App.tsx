import { Pages } from '@/pages/Pages.jsx';
import { clientDescriptor, hooks } from '@/store.js';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { Provider as UIProvider } from '@a-type/ui/components/provider';
import { H1, P } from '@a-type/ui/components/typography';
import { useVisualViewportOffset } from '@a-type/ui/hooks';
import { Provider, ReloadButton } from '@biscuits/client';
import { ReactNode, Suspense } from 'react';

export interface AppProps {}

export function App({}: AppProps) {
  useVisualViewportOffset();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <UIProvider toastContainerClassName="mb-10 sm:mb-0">
        <Suspense>
          <VerdantProvider>
            <Provider
              appId="wish-wash"
              storeDescriptor={clientDescriptor as any}
            >
              <Pages />
            </Provider>
          </VerdantProvider>
        </Suspense>
      </UIProvider>
    </ErrorBoundary>
  );
}

function VerdantProvider({ children }: { children: ReactNode }) {
  return <hooks.Provider value={clientDescriptor}>{children}</hooks.Provider>;
}

function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-start justify-center gap-4 max-w-700px">
        <H1>Something went wrong</H1>
        <P>
          Sorry about this. The app has crashed. You can try refreshing, but if
          that doesn&apos;t work,{' '}
          <a className="underline font-bold" href="mailto:hi@biscuits.club">
            let me know about it.
          </a>
        </P>
        <ReloadButton />
      </div>
    </div>
  );
}
