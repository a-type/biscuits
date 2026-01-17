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
					<DialogContent className="important:(h-90dvh max-h-none) important:sm:(max-w-75dvw)">
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
