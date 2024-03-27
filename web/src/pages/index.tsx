import { TopLoader } from '@/components/nav/TopLoader.jsx';
import { Outlet, Router, makeRoutes } from '@verdant-web/react-router';
import { Suspense, lazy } from 'react';
import RefreshSessionPage from './RefreshSessionPage.jsx';
const HomePage = lazy(() => import('./HomePage.js'));

const routes = makeRoutes([
  {
    index: true,
    path: '/',
    component: HomePage,
  },
  {
    path: '/join',
    component: lazy(() => import('./JoinPage.js')),
  },
  {
    path: '/verify',
    component: lazy(() => import('./VerifyPage.js')),
  },
  {
    path: '/plan',
    component: lazy(() => import('./PlanPage.js')),
  },
  {
    path: '/login',
    component: lazy(() => import('./LoginPage.jsx')),
  },
  {
    path: '/invite/:code',
    component: lazy(() => import('./ClaimInvitePage.js')),
  },
  {
    path: '/refresh-session',
    component: RefreshSessionPage,
  },
  {
    path: '/apps',
    component: lazy(() => import('./AppsPage.jsx')),
  },
]);

export function Pages() {
  return (
    <Router routes={routes}>
      <Suspense>
        <TopLoader />
        <Outlet />
      </Suspense>
    </Router>
  );
}
