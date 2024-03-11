import { Button, ButtonProps } from '@a-type/ui/components/button';
import { CONFIG, useAppId } from '../index.js';

export interface ManagePlanButtonProps extends ButtonProps {}

export function ManagePlanButton({
  children,
  ...props
}: ManagePlanButtonProps) {
  const appReferrer = useAppId();
  return (
    <Button asChild {...props}>
      <a href={`${CONFIG.HOME_ORIGIN}/plan?fromApp=${appReferrer}`}>
        {children || 'Manage plan'}
      </a>
    </Button>
  );
}
