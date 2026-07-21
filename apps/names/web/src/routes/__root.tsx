import { LocationRequestDialog } from '@/components/location/LocationRequestDialog.jsx';
import { SuperBar } from '@/components/superBar/SuperBar.jsx';
import { SuperBarProvider } from '@/components/superBar/SuperBarContext.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import { PageContent, PageRoot, Spinner } from '@a-type/ui';
import { DefaultErrorBoundary } from '@biscuits/client';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFoundPage,
});

function RootComponent() {
	return (
		<DefaultErrorBoundary>
			<SuperBarProvider>
				<Suspense
					fallback={
						<Spinner
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								transform: 'translate(-50%, -50%)',
							}}
						/>
					}
				>
					<PageRoot>
						<PageContent>
							<Suspense>
								<SuperBar />
							</Suspense>
							<Suspense
								fallback={
									<Spinner
										style={{
											position: 'absolute',
											left: '50%',
											top: '50%',
											transform: 'translate(-50%, -50%)',
										}}
									/>
								}
							>
								<Outlet />
							</Suspense>
						</PageContent>
					</PageRoot>
				</Suspense>
				<LocationRequestDialog />
			</SuperBarProvider>
		</DefaultErrorBoundary>
	);
}
