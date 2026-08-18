import NotFoundPage from '@/pages/NotFoundPage.jsx';
import {
	GlobalErrorFallback,
	updateApp,
	updateState,
} from '@biscuits/client/apps';
import { commonRouterConfig } from '@biscuits/client/router';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.js';

export const router = createRouter({
	...commonRouterConfig,
	routeTree,
	defaultErrorComponent: GlobalErrorFallback,
	defaultNotFoundComponent: NotFoundPage,
});

router.subscribe('onBeforeNavigate', (event) => {
	if (updateState.updateAvailable && event.pathChanged) {
		console.info('Update ready to install, intercepting navigation...');
		updateApp();
		return false;
	}
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
