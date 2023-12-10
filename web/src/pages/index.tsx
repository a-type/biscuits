import { Outlet, Router, makeRoutes } from '@verdant-web/react-router';
import { lazy } from 'react';

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
]);

export function Pages() {
  return (
    <Router routes={routes}>
      <Outlet />
    </Router>
  );
}
