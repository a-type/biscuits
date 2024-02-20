import { Button, ButtonProps } from '@a-type/ui/components/button';
import { API_HOST_HTTP } from '@/config';
import { ReactNode } from 'react';

export function OAuthSignInButton({
  provider,
  returnTo,
  children,
  className,
  inviteId,
  ...rest
}: {
  provider: string;
  returnTo?: string | null;
  children?: ReactNode;
  inviteId?: string | null;
} & ButtonProps) {
  const url = new URL(`${API_HOST_HTTP}/auth/provider/${provider}/login`);
  if (returnTo) {
    url.searchParams.set('returnTo', returnTo);
  }
  if (inviteId) {
    url.searchParams.set('inviteId', inviteId);
  }

  return (
    <form action={url.toString()} className={className} method="post">
      <Button type="submit" {...rest}>
        {children}
      </Button>
    </form>
  );
}
