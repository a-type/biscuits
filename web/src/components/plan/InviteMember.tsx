import { FormikForm, SubmitButton, TextField, toast } from '@a-type/ui';
import { graphql, useMutation } from '@biscuits/graphql';
import classes from './InviteMember.module.css';

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
			className={classes.fullWidth}
		>
			<TextField name="email" label="Email" className={classes.fullWidth} />
			<SubmitButton>Invite</SubmitButton>
		</FormikForm>
	);
}
