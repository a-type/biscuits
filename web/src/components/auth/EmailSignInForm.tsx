import { API_HOST_HTTP } from '@/config.js';
import { Button } from '@a-type/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@a-type/ui/components/dialog';

export interface EmailSignInFormProps {
  returnTo?: string;
}

export function EmailSignInForm({ returnTo = '' }: EmailSignInFormProps) {
  return (
    <form action={`${API_HOST_HTTP}/auth/email-login?returnTo=${returnTo}`}>
      <input name="email" autoComplete="email" required />
      <input
        autoComplete="current-password"
        name="password"
        type="password"
        required
      />
      <Button type="submit">Sign In</Button>
      <ForgotPassword />
    </form>
  );
}

function ForgotPassword() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-none border-none p-0 color-black underline cursor-pointer">
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent>
        <form action={`${API_HOST_HTTP}/auth/begin-reset-password`}>
          <input name="email" />
          <Button type="submit">Send reset email</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
