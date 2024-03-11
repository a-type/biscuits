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
      action={`${CONFIG.API_ORIGIN}/auth/email-login?returnTo=${returnTo}`}
    >
      <Input name="email" autoComplete="email" required />
      <Input
        autoComplete="current-password"
        name="password"
        type="password"
        required
      />
      <Button type="submit" className="self-end">
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
        <form action={`${CONFIG.API_ORIGIN}/auth/begin-reset-password`}>
          <input name="email" />
          <Button type="submit">Send reset email</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
