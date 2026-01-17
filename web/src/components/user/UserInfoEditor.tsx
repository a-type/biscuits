import {
	Button,
	clsx,
	FormikForm,
	H2,
	Icon,
	SubmitButton,
	TextField,
} from '@a-type/ui';
import { useMutation } from '@biscuits/graphql';
import { useState } from 'react';
import { FragmentOf, graphql, readFragment } from '../../graphql.js';

export const userInfoFragment = graphql(`
	fragment UserInfoEditor_userInfoFragment on User {
		id
		name
	}
`);

const updateUserInfo = graphql(
	`
		mutation UpdateUserInfo($name: String) {
			updateUserInfo(input: { name: $name }) {
				...UserInfoEditor_userInfoFragment
			}
		}
	`,
	[userInfoFragment],
);

export interface UserInfoEditorProps {
	user: FragmentOf<typeof userInfoFragment>;
	className?: string;
}

export function UserInfoEditor({ user, className }: UserInfoEditorProps) {
	const userData = readFragment(userInfoFragment, user);
	const [update] = useMutation(updateUserInfo);
	const [editing, setEditing] = useState(false);

	if (!editing) {
		return (
			<div className={clsx('w-full col items-start py-3', className)}>
				<div className="w-full row justify-between">
					<H2>Your profile</H2>
					<Button emphasis="ghost" onClick={() => setEditing(true)}>
						<Icon name="pencil" /> Edit
					</Button>
				</div>

				<div>Name: {userData.name}</div>
			</div>
		);
	}

	return (
		<FormikForm
			initialValues={{ name: userData.name }}
			onSubmit={async (values) => {
				await update({ variables: values });
				setEditing(false);
			}}
			className="py-3"
		>
			<TextField name="name" label="Name" />
			<div className="w-full row justify-end">
				<Button onClick={() => setEditing(false)}>Cancel</Button>
				<SubmitButton>Save</SubmitButton>
			</div>
		</FormikForm>
	);
}
