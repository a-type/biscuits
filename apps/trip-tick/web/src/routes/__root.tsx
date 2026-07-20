import NotFoundPage from '@/pages/NotFoundPage.jsx';
import { PageRoot } from '@a-type/ui';
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundPage,
});

function RootComponent() {
	return (
		<PageRoot>
			<Outlet />
		</PageRoot>
	);
}
