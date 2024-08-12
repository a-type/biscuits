import { ListDetailsDialog } from '@/components/lists/ListDetailsDialog.jsx';
import { updateApp, updateState } from '@/updateState.js';
import { Button } from '@a-type/ui/components/button';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { PageRoot } from '@a-type/ui/components/layouts';
import { Spinner } from '@a-type/ui/components/spinner';
import { H1, P } from '@a-type/ui/components/typography';
import { ReloadButton } from '@biscuits/client';
import { Link, makeRoutes, Outlet, Router } from '@verdant-web/react-router';
import { lazy, Suspense, useCallback } from 'react';
import { HomePage } from './HomePage.jsx';
import ListPage from './ListPage.jsx';
import { ShareTargetListPicker } from '@/components/shareTarget/ShareTargetListPicker.jsx';

const routes = makeRoutes([
  {
    path: '/',
    exact: true,
    component: HomePage,
  },
  {
    path: '/buy-yearly',
    component: lazy(() => import('./BuyYearlyPage.jsx')),
  },
  {
    path: '/settings',
    component: lazy(() => import('./SettingsPage.jsx')),
  },
  {
    path: '/:listId',
    component: ListPage,
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
          <Outlet />
          <ListDetailsDialog />
          <ShareTargetListPicker />
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
