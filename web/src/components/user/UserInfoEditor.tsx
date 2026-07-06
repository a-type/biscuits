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
import classes from './UserInfoEditor.module.css';

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
			<div className={clsx(classes.root, className)}>
				<div className={classes.header}>
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
			className={classes.form}
		>
			<TextField name="name" label="Name" />
			<div className={classes.formActions}>
				<Button onClick={() => setEditing(false)}>Cancel</Button>
				<SubmitButton>Save</SubmitButton>
			</div>
		</FormikForm>
	);
}
