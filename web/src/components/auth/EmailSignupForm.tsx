import { Button } from '@a-type/ui/components/button';
import {
  FormikForm,
  SubmitButton,
  TextField,
} from '@a-type/ui/components/forms';
import { Input } from '@a-type/ui/components/input';
import { CONFIG, fetch } from '@biscuits/client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export interface EmailSignUpFormProps {
  returnTo?: string | null;
  actionText?: string;
}

export function EmailSignUpForm({
  returnTo,
  actionText = 'Start signup',
}: EmailSignUpFormProps) {
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-lg">Check your email for a verification code.</p>
      </div>
    );
  }

  return (
    <FormikForm
      initialValues={{
        name: '',
        email: '',
      }}
      onSubmit={async (values, helpers) => {
        try {
          // this API accepts form data
          const formData = new FormData();
          formData.append('name', values.name);
          formData.append('email', values.email);
          formData.append('returnTo', returnTo ?? '');
          const response = await fetch(
            `${CONFIG.API_ORIGIN}/auth/begin-email-signup`,
            {
              method: 'post',
              body: formData,
              headers: {},
            },
          );
          if (response.ok) {
            setSuccess(true);
          }
        } catch (e) {
          console.error(e);
        }
      }}
      className="flex flex-col gap-2"
    >
      <TextField name="name" label="Name" autoComplete="given-name" required />
      <TextField
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        required
      />
      <SubmitButton type="submit" className="self-end" color="primary">
        {actionText}
      </SubmitButton>
    </FormikForm>
  );
}
