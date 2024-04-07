import { useCallback } from 'react';
import { lazyWithPreload as lazy } from 'react-lazy-with-preload';
import { makeRoutes, Router, Outlet } from '@verdant-web/react-router';
import { updateApp, updateState } from '@/updateState.js';
import { PageRoot } from '@a-type/ui/components/layouts';
import { TopLoader } from '@/components/nav/TopLoader.jsx';
import { Navigation } from '@/components/nav/Navigation.jsx';
import { LogoutNotice } from '@biscuits/client';

// dynamically import pages that may not be visited
const ListsPage = lazy(() => import('./ListsPage.jsx'));
const ListPage = lazy(() => import('./ListPage.jsx'));
const TripsPage = lazy(() => import('./TripsPage.jsx'));
const TripPage = lazy(() => import('./TripPage.jsx'));

const routes = makeRoutes([
  {
    path: '/',
    component: TripsPage,
    exact: true,
    onVisited() {
      ListsPage.preload();
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
    path: '/lists',
    component: ListsPage,
    onVisited() {
      ListPage.preload();
      TripsPage.preload();
    },
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
        <TopLoader />
        <LogoutNotice />
      </Router>
      <Navigation />
    </PageRoot>
  );
}
