'use client';

import { API_HOST_HTTP } from '@/config';
import { Button } from '@a-type/ui/components/button';
import { Input } from '@a-type/ui/components/input';

export interface EmailSignUpFormProps {
  returnTo?: string | null;
}

export function EmailSignUpForm({ returnTo }: EmailSignUpFormProps) {
  return (
    <form
      action={`${API_HOST_HTTP}/auth/begin-email-signup?returnTo=${returnTo}`}
    >
      <Input name="name" autoComplete="given-name" required />
      <Input name="email" autoComplete="email" required />
      <Button type="submit">Sign Up</Button>
    </form>
  );
}
