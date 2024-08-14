import { Button, ButtonProps } from '@a-type/ui/components/button';
import { useAppId } from './Context.js';
import * as CONFIG from '../config.js';

export interface ManagePlanButtonProps extends ButtonProps {}

export function ManagePlanButton({
  children,
  ...props
}: ManagePlanButtonProps) {
  const appReferrer = useAppId();
  return (
    <Button asChild {...props}>
      <a href={`${CONFIG.HOME_ORIGIN}/settings?appReferrer=${appReferrer}`}>
        {children || 'Manage plan'}
      </a>
    </Button>
  );
}
