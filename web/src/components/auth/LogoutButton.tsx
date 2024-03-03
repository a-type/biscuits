import { Button, ButtonProps } from '@a-type/ui/components/button';
import { API_HOST_HTTP, SECURE } from '@/config.js';

export function LogoutButton({ children, ...rest }: ButtonProps) {
  return (
    <form action={`${API_HOST_HTTP}/auth/logout`} method="post">
      <Button type="submit" {...rest}>
        {children}
      </Button>
    </form>
  );
}
