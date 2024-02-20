import { Input } from '@a-type/ui/components/input';
import { Button } from '@a-type/ui/components/button';
import { API_HOST_HTTP } from '@/config';

export interface EmailCompleteSignUpFormProps {
  code: string;
  email: string;
}

export function EmailCompleteSignupForm({
  code,
  email,
}: EmailCompleteSignUpFormProps) {
  return (
    <form action={`${API_HOST_HTTP}/auth/complete-email-signup`}>
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
