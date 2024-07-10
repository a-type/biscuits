import {
  FormikForm,
  SubmitButton,
  TextField,
} from '@a-type/ui/components/forms';
import { useListContext } from './ListContext.jsx';
import { createdItemState } from './state.js';
import { hooks } from '@/store.js';
import { authorization } from '@wish-wash.biscuits/verdant';

export interface CreateItemProps {}

export function CreateItem({}: CreateItemProps) {
  const { listId, list } = useListContext();
  const client = hooks.useClient();

  return (
    <FormikForm
      initialValues={{ description: '' }}
      onSubmit={async (values, form) => {
        const item = await client.items.put(
          {
            listId,
            description: values.description,
          },
          {
            access: list.isAuthorized
              ? authorization.private
              : authorization.public,
          },
        );
        // actually don't need to focus edit on this since we just
        // named it...
        // createdItemState.justCreatedId = item.get('id');
        form.resetForm();
      }}
      className="!row items-center gap-2"
    >
      <TextField
        name="description"
        required
        className="flex-1"
        variant="primary"
      />
      <SubmitButton>Add</SubmitButton>
    </FormikForm>
  );
}
