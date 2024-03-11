import { Button } from '@a-type/ui/components/button';
import { Input } from '@a-type/ui/components/input';
import { CONFIG } from '@biscuits/client';

export interface EmailSignUpFormProps {
  returnTo?: string | null;
}

export function EmailSignUpForm({ returnTo }: EmailSignUpFormProps) {
  return (
    <form
      action={`${CONFIG.API_ORIGIN}/auth/begin-email-signup?returnTo=${returnTo}`}
      className="flex flex-col gap-2"
    >
      <Input name="name" autoComplete="given-name" required />
      <Input name="email" autoComplete="email" required />
      <Button type="submit" className="self-end">
        Sign Up
      </Button>
    </form>
  );
}
