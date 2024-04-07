import { Button, ButtonProps } from '@a-type/ui/components/button';
import { CONFIG } from '../index.js';

export interface LoginButtonProps extends ButtonProps {
  returnTo?: string;
}

export function LoginButton(props: LoginButtonProps) {
  const url = new URL(CONFIG.HOME_ORIGIN + '/login');
  if (props.returnTo) {
    url.searchParams.set('returnTo', props.returnTo);
  }
  return (
    <Button asChild {...props}>
      <a href={url.toString()}>Login</a>
    </Button>
  );
}
