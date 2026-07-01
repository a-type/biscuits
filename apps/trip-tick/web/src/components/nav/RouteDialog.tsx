import { Dialog, DialogContent } from '@a-type/ui';
import { Outlet, RouteRenderer, useNavigate } from '@verdant-web/react-router';
import { Suspense } from 'react';

export function RouteDialog() {
	const navigate = useNavigate();
	return (
		<Outlet>
			{(match, params) => (
				<Dialog
					open={!!match}
					onOpenChange={(open) => {
						if (!open && !!match) {
							const oneLevelUp = window.location.pathname
								.split('/')
								.slice(0, -1)
								.join('/');
							navigate(oneLevelUp || '/');
						}
					}}
				>
					<DialogContent
						style={{
							height: '90dvh',
							maxHeight: 'none',
							maxWidth: '75dvw',
						}}
					>
						<Suspense>
							{match ?
								<RouteRenderer value={match} params={params} />
							:	null}
						</Suspense>
					</DialogContent>
				</Dialog>
			)}
		</Outlet>
	);
}
