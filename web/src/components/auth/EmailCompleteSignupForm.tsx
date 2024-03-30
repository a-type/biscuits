import { Input } from '@a-type/ui/components/input';
import { Button } from '@a-type/ui/components/button';
import { CONFIG } from '@biscuits/client';
import { Form } from '@a-type/ui/components/forms';

export interface EmailCompleteSignUpFormProps {
  code: string;
  email: string;
}

export function EmailCompleteSignupForm({
  code,
  email,
}: EmailCompleteSignUpFormProps) {
  return (
    <form
      action={`${CONFIG.API_ORIGIN}/auth/complete-email-signup`}
      method="post"
      className="flex flex-col gap-2"
    >
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="email" value={email} />
      <label htmlFor="password">Password</label>
      <Input
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />
      <Button className="self-end" color="primary" type="submit">
        Sign In
      </Button>
    </form>
  );
}
