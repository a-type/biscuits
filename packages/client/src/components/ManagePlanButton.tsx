import { Button, ButtonProps } from '@a-type/ui/components/button';
import { CONFIG } from '../index.js';

export interface ManagePlanButtonProps extends ButtonProps {}

export function ManagePlanButton(props: ManagePlanButtonProps) {
  return (
    <Button asChild {...props}>
      <a href={CONFIG.UI_ORIGIN + '/plan'}>Manage subscription</a>
    </Button>
  );
}
