import { Button, ButtonProps } from '@a-type/ui/components/button';
import { API_ORIGIN, SECURE } from '@/config';

export function LogoutButton({ children, ...rest }: ButtonProps) {
  return (
    <form
      action={`${SECURE ? 'https' : 'http'}://${API_ORIGIN}/api/auth/logout`}
      method="post"
    >
      <Button type="submit" {...rest}>
        {children}
      </Button>
    </form>
  );
}
