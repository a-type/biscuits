import {
  Outlet,
  RouteRenderer,
  useMatch,
  useMatchingRoute,
  useNavigate,
} from '@verdant-web/react-router';
import { Dialog, DialogContent } from '@a-type/ui/components/dialog';
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
          <DialogContent className="important:(max-h-none h-90vh) important:sm:(max-w-75vw)">
            <Suspense>
              {match ? <RouteRenderer value={match} params={params} /> : null}
            </Suspense>
          </DialogContent>
        </Dialog>
      )}
    </Outlet>
  );
}
