import { clsx } from '@a-type/ui';
import { Button } from '@a-type/ui/components/button';
import {
  FormikForm,
  SubmitButton,
  TextField,
} from '@a-type/ui/components/forms';
import { Icon } from '@a-type/ui/components/icon';
import {
  FragmentOf,
  graphql,
  readFragment,
  useMutation,
} from '@biscuits/client';
import { useState } from 'react';

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
      <div className={clsx('col w-full items-start', className)}>
        <div>Name: {userData.name}</div>
        <Button color="ghost" onClick={() => setEditing(true)}>
          <Icon name="pencil" /> Edit
        </Button>
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
    >
      <TextField name="name" label="Name" />
      <div className="row justify-end w-full">
        <Button onClick={() => setEditing(false)}>Cancel</Button>
        <SubmitButton>Save</SubmitButton>
      </div>
    </FormikForm>
  );
}
