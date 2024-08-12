import { TopLoader } from '@/components/nav/TopLoader.jsx';
import {
  Outlet,
  RestoreScroll,
  Router,
  makeRoutes,
} from '@verdant-web/react-router';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
const HomePage = lazy(() => import('./HomePage.js'));
const ErrorPage = lazy(() => import('./ErrorPage.jsx'));

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
    path: '/apps',
    component: lazy(() => import('./AppsPage.jsx')),
  },
  {
    path: '/gnocchi',
    component: lazy(() => import('./promos/GnocchiPage.jsx')),
  },
  {
    path: '/trip-tick',
    component: lazy(() => import('./promos/TripTickPage.jsx')),
  },
  {
    path: '/contact',
    component: lazy(() => import('./ContactPage.js')),
  },
  {
    path: '/about',
    component: lazy(() => import('./AboutPage.jsx')),
  },
  {
    path: '/privacy',
    component: lazy(() => import('./PrivacyPage.js')),
  },
  {
    path: '/tos',
    component: lazy(() => import('./TermsPage.js')),
  },
  {
    path: '/reset-password',
    component: lazy(() => import('./ResetPasswordPage.js')),
  },
  {
    path: '/return-to-app',
    component: lazy(() => import('./BackToAppPage.js')),
  },
  {
    path: '/admin',
    component: lazy(() => import('./admin/AdminPage.js')),
    children: [
      {
        path: 'plans',
        component: lazy(() => import('./admin/AdminPlansPage.js')),
      },
      {
        path: 'foods',
        component: lazy(() => import('./admin/AdminFoodsPage.js')),
      },
      {
        path: 'changelogs',
        component: lazy(() => import('./admin/AdminChangelogsPage.js')),
      },
    ],
  },
  {
    path: '*',
    component: lazy(() => import('./NotFoundPage.jsx')),
  },
]);

export function Pages() {
  return (
    <Router routes={routes}>
      <ErrorBoundary fallback={<ErrorPage />}>
        <Suspense>
          <Outlet />
          <RestoreScroll />
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}
