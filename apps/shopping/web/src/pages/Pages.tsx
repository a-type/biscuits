import { makeRoutes, Outlet, Router } from '@verdant-web/react-router';
import { HomePage } from './HomePage.jsx';
import { H1, P } from '@a-type/ui/components/typography';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { Button } from '@a-type/ui/components/button';
import { Spinner } from '@a-type/ui/components/spinner';
import { lazy, useCallback, Suspense } from 'react';
import { updateApp, updateState } from '@/updateState.js';
import { Link } from '@verdant-web/react-router';
import { TopLoader } from '@/components/nav/TopLoader.jsx';
import { ReloadButton } from '@biscuits/client';
import ListPage from './ListPage.jsx';
import { PageRoot } from '@a-type/ui/components/layouts';

const routes = makeRoutes([
  {
    path: '/',
    exact: true,
    component: HomePage,
  },
  {
    path: '/list/:listId',
    component: ListPage,
  },
  {
    path: '/settings',
    component: lazy(() => import('./SettingsPage.jsx')),
  },
]);

export function Pages() {
  const handleNavigate = useCallback(
    (_: Location, ev: { state?: any; skipTransition?: boolean }) => {
      if (updateState.updateAvailable) {
        console.info('Update ready to install, intercepting navigation...');
        updateApp();
        return false;
      }
    },
    [],
  );
  return (
    <ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
      <Suspense fallback={<Spinner />}>
        <Router routes={routes} onNavigate={handleNavigate}>
          <TopLoader />
          <PageRoot>
            <Outlet />
          </PageRoot>
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
}

function ErrorFallback({ clearError }: { clearError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-start justify-center gap-4 max-w-content">
        <H1>Something went wrong</H1>
        <P>
          Sorry about this. The app has crashed. You can try refreshing, but if
          that doesn't work, use the button below to report the issue.
        </P>
        <Button asChild>
          <Link to="/" onClick={clearError}>
            Go Home
          </Link>
        </Button>
        <ReloadButton />
      </div>
    </div>
  );
}
