import { Input } from '@a-type/ui/components/input';
import { Button } from '@a-type/ui/components/button';
import { CONFIG } from '@biscuits/client';

export interface EmailCompleteSignUpFormProps {
  code: string;
  email: string;
}

export function EmailCompleteSignupForm({
  code,
  email,
}: EmailCompleteSignUpFormProps) {
  return (
    <form action={`${CONFIG.API_ORIGIN}/auth/complete-email-signup`}>
      <input type="hidden" name="code" value={code} />
      <label htmlFor="email">Email</label>
      <Input name="email" autoComplete="email" required disabled={!!email} />
      <label htmlFor="password">Password</label>
      <Input
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />
      <Button type="submit">Sign In</Button>
    </form>
  );
}
