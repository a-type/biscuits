import { graphql } from '@/graphql';
import {
  FormikForm,
  SubmitButton,
  TextField,
} from '@a-type/ui/components/forms';
import { useMutation } from 'urql';

const invite = graphql(`
  mutation CreateInvitation($input: CreatePlanInvitationInput!) {
    createPlanInvitation(input: $input) {
      id
    }
  }
`);

export interface InviteMemberProps {}

export function InviteMember({}: InviteMemberProps) {
  const [_, createInvitation] = useMutation(invite);

  return (
    <FormikForm
      initialValues={{ email: '' }}
      onSubmit={async ({ email }, bag) => {
        await createInvitation({ input: { email } });
        bag.resetForm();
      }}
      className="p-3"
    >
      <TextField name="email" label="Email" />
      <SubmitButton>Invite</SubmitButton>
    </FormikForm>
  );
}
