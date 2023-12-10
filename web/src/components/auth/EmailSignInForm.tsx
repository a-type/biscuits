import { Formik } from 'formik';
import { Form, SubmitButton, TextField } from '@a-type/ui/components/forms';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@a-type/ui/components/dialog';
import { P } from '@a-type/ui/components/typography';
import { client } from '@biscuits/client/react';
import { useNavigate } from '@verdant-web/react-router';

export interface EmailSignInFormProps {
  returnTo?: string;
}

export function EmailSignInForm({ returnTo }: EmailSignInFormProps) {
  const { mutateAsync, error } = client.auth.emailLogin.useMutation();
  const { refetch } = client.auth.session.useQuery();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ password: '', email: '' }}
      onSubmit={async (values) => {
        await mutateAsync({
          email: values.email,
          password: values.password,
          returnTo,
        });
        refetch();
        // TODO: cross origin redirect to other apps
        navigate(returnTo || '/');
      }}
    >
      <Form>
        <TextField name="email" label="Email" autoComplete="email" required />
        <TextField
          autoComplete="current-password"
          name="password"
          label="Password"
          type="password"
          required
        />
        <SubmitButton>Sign In</SubmitButton>
        <ForgotPassword />
        {error && <P className="color-attention">{error.message}</P>}
      </Form>
    </Formik>
  );
}

function ForgotPassword() {
  const { mutateAsync, error } = client.auth.resetPassword.useMutation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-none border-none p-0 color-black underline cursor-pointer">
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent>
        <Formik
          initialValues={{
            email: '',
          }}
          onSubmit={async (values) => {
            try {
              await mutateAsync({ email: values.email });
              alert('Check your email for a password reset link.');
            } catch (err) {}
          }}
        >
          <Form>
            <TextField name="email" label="Email" />
            <SubmitButton>Send reset email</SubmitButton>
            {error && <P className="color-attention">{error.message}</P>}
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
