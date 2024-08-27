import { graphql, useMutation } from '@biscuits/graphql';
import {
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';
import { toast } from '@a-type/ui';

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
			className="p-3"
		>
			<TextField name="email" label="Email" />
			<SubmitButton>Invite</SubmitButton>
		</FormikForm>
	);
}
