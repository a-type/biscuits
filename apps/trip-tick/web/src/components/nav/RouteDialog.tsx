import { Dialog, DialogContent } from '@a-type/ui';
import {
	Outlet,
	RouteRenderer,
	useMatchingRoute,
	useNavigate,
} from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface RouteDialogProps {}

export function RouteDialog(props: RouteDialogProps) {
	const navigate = useNavigate();
	const upper = useMatchingRoute();
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
					<DialogContent className="important:(max-h-none h-90dvh) important:sm:(max-w-75dvw)">
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
