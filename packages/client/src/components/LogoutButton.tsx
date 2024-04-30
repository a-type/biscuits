import { Button, ButtonProps } from '@a-type/ui/components/button';
import { CONFIG } from '../index.js';
import { Icon } from '@a-type/ui/components/icon';
import { useWasLoggedIn } from '../hooks/useWasLoggedIn.js';

export interface LogoutButtonProps extends ButtonProps {
  returnTo?: string;
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const url = new URL(CONFIG.API_ORIGIN + '/auth/logout');
  if (props.returnTo) {
    url.searchParams.set('returnTo', props.returnTo);
  }

  const [_, setWasLoggedIn] = useWasLoggedIn();

  return (
    <Button asChild {...props}>
      <a href={url.toString()} onClick={() => setWasLoggedIn(false)}>
        {children ?? (
          <>
            Log out
            <Icon name="arrowRight" />
          </>
        )}
      </a>
    </Button>
  );
}
