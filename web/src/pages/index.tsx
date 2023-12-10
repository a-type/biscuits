import { Outlet, Router, makeRoutes } from '@verdant-web/react-router';
import { Suspense, lazy } from 'react';

const HomePage = lazy(() => import('./HomePage.js'));
const JoinPage = lazy(() => import('./JoinPage.js'));

const routes = makeRoutes([
  {
    index: true,
    path: '/',
    component: HomePage,
  },
  {
    path: '/join',
    component: JoinPage,
  },
  {
    path: '/verify',
    component: lazy(() => import('./VerifyPage.js')),
  },
  {
    path: '/plan',
    component: lazy(() => import('./PlanPage.js')),
  },
]);

export function Pages() {
  return (
    <Router routes={routes}>
      <Suspense>
        <Outlet />
      </Suspense>
    </Router>
  );
}
