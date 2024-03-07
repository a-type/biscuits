import { Button, ButtonProps } from '@a-type/ui/components/button';
import { CONFIG } from '../index.js';

export interface LogoutButtonProps extends ButtonProps {
  returnTo?: string;
}

export function LogoutButton(props: LogoutButtonProps) {
  const url = new URL(CONFIG.API_ORIGIN + '/auth/logout');
  if (props.returnTo) {
    url.searchParams.set('returnTo', props.returnTo);
  }
  return (
    <Button asChild {...props}>
      <a href={url.toString()}>Login</a>
    </Button>
  );
}
