import { graphql } from '@/graphql.js';
import { FormikForm, SubmitButton, TextField, toast } from '@a-type/ui';
import { useMutation } from '@biscuits/graphql';

const invite = graphql(`
	mutation CreateInvitation($input: CreatePlanInvitationInput!) {
		createPlanInvitation(input: $input) {
			plan {
				id
				pendingInvitations {
					id
					email
				}
			}
		}
	}
`);

export interface InviteMemberProps {}

export function InviteMember({}: InviteMemberProps) {
	const [createInvitation] = useMutation(invite);

	return (
		<FormikForm
			initialValues={{ email: '' }}
			onSubmit={async ({ email }, bag) => {
				await createInvitation({ variables: { input: { email } } });
				bag.resetForm();
				toast.success('Invitation sent!');
			}}
		>
			<TextField name="email" label="Email" />
			<SubmitButton>Invite</SubmitButton>
		</FormikForm>
	);
}
