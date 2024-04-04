import { Button } from '@a-type/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@a-type/ui/components/dialog';
import { Input } from '@a-type/ui/components/input';
import { CONFIG } from '@biscuits/client';

export interface EmailSignInFormProps {
  returnTo?: string;
}

export function EmailSignInForm({ returnTo = '' }: EmailSignInFormProps) {
  return (
    <form
      className="flex flex-col gap-2"
      method="post"
      action={`${CONFIG.API_ORIGIN}/auth/email-login?returnTo=${returnTo}`}
    >
      <label htmlFor="email" className="font-bold">
        Email
      </label>
      <Input name="email" autoComplete="email" required />
      <label htmlFor="password" className="font-bold">
        Password
      </label>
      <Input
        autoComplete="current-password"
        name="password"
        type="password"
        required
      />
      <Button type="submit" className="self-end" color="primary">
        Sign In
      </Button>
      <ForgotPassword className="self-end" />
    </form>
  );
}

function ForgotPassword({ className }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        <button className="bg-transparent border-none p-0 color-black underline cursor-pointer">
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="flex flex-col gap-2"
          method="post"
          action={`${CONFIG.API_ORIGIN}/auth/begin-reset-password`}
        >
          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <input type="hidden" name="returnTo" value={window.location.href} />
          <Input name="email" type="email" required />
          <Button type="submit" className="self-end">
            Send reset email
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
