import { updateApp, updateState } from '@/updateState.js';
import { PageRoot } from '@a-type/ui/components/layouts';
import { Outlet, Router, makeRoutes } from '@verdant-web/react-router';
import { useCallback } from 'react';
import { lazyWithPreload as lazy } from 'react-lazy-with-preload';

// dynamically import pages that may not be visited
const ListPage = lazy(() => import('./ListPage.jsx'));
const TripsPage = lazy(() => import('./TripsPage.jsx'));
const TripPage = lazy(() => import('./TripPage.jsx'));

const routes = makeRoutes([
  {
    path: '/',
    component: TripsPage,
    exact: true,
    onVisited() {
      TripPage.preload();
    },
  },
  {
    path: '/trips/:tripId',
    component: TripPage,
  },
  {
    path: '/lists/:listId',
    component: ListPage,
  },
  {
    path: '/settings',
    component: lazy(() => import('./SettingsPage.jsx')),
  },
  {
    path: '*',
    component: lazy(() => import('./NotFoundPage.jsx')),
  },
]);

export function Pages() {
  const onNavigate = useCallback(() => {
    if (updateState.updateAvailable) {
      updateApp(true);
      return false;
    }
  }, []);
  return (
    <PageRoot>
      <Router routes={routes} onNavigate={onNavigate}>
        <Outlet />
      </Router>
    </PageRoot>
  );
}
