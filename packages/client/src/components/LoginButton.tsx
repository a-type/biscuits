import { Button, ButtonProps } from '@a-type/ui/components/button';
import { CONFIG } from '../index.js';

export interface LoginButtonProps extends ButtonProps {
  returnTo?: string;
}

export function LoginButton(props: LoginButtonProps) {
  const url = new URL(CONFIG.HOME_ORIGIN + '/login');

  url.searchParams.set('returnTo', props.returnTo ?? window.location.href);

  return (
    <Button asChild {...props}>
      <a href={url.toString()}>Login</a>
    </Button>
  );
}
