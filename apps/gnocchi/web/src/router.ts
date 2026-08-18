import NotFoundPage from '@/pages/NotFoundPage.jsx';
import {
	GlobalErrorFallback,
	updateApp,
	updateState,
} from '@biscuits/client/apps';
import { commonRouterConfig } from '@biscuits/client/router';
import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.js';
import { verdant } from './stores/groceries/index.js';

export const router = createRouter({
	...commonRouterConfig,
	routeTree,
	getScrollRestorationKey(location) {
		// always restore recipes main page to the same position
		if (location.pathname === '/recipes') {
			return 'recipes';
		}
		return location.pathname;
	},
	defaultErrorComponent: GlobalErrorFallback,
	defaultNotFoundComponent: NotFoundPage,
});

router.subscribe('onBeforeNavigate', (event) => {
	// only update on path changes
	if (updateState.updateAvailable && event.pathChanged) {
		console.info('Update ready to install, intercepting navigation...');
		updateApp();
		return false;
	}
	if (!event.fromLocation) {
		return;
	}
	// if first-level path changes, reset undo state
	const firstLevelFrom = event.fromLocation?.pathname.split('/')[0];
	const firstLevelTo = event.toLocation.pathname.split('/')[0];
	if (firstLevelFrom !== firstLevelTo) {
		verdant.undoHistory.clear();
	}
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
