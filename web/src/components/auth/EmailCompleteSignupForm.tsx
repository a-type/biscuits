import { Formik } from 'formik';
import { Form, SubmitButton, TextField } from '@a-type/ui/components/forms';
import { isClientError } from '@biscuits/client';
import { client } from '@biscuits/client/react';

export interface EmailCompleteSignUpFormProps {
  code: string;
  email: string;
  onSuccess: (user: any) => void;
}

export function EmailCompleteSignupForm({
  code,
  email,
  onSuccess,
}: EmailCompleteSignUpFormProps) {
  const { mutateAsync } = client.auth.verifyEmail.useMutation();
  const { refetch } = client.auth.session.useQuery();

  return (
    <Formik
      initialValues={{ password: '', email }}
      onSubmit={async (values) => {
        try {
          const result = await mutateAsync({
            code,
            email: values.email,
            password: values.password,
          });
          if (result.user) {
            refetch();
            onSuccess(result.user);
          } else {
            alert(
              'Invalid code. Check that you used the latest email, or try signing up again.',
            );
          }
        } catch (err) {
          if (isClientError(err)) {
            alert(err.message);
          } else {
            alert('Error verifying email');
          }
          console.error(err);
        }
      }}
    >
      <Form>
        <TextField
          name="email"
          label="Email"
          autoComplete="email"
          required
          disabled={!!email}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
        />
        <SubmitButton>Sign In</SubmitButton>
      </Form>
    </Formik>
  );
}
