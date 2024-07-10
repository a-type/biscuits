import { hooks } from '@/store.js';
import {
  FormikForm,
  SubmitButton,
  TextField,
} from '@a-type/ui/components/forms';
import { isUrl } from '@a-type/utils';
import { authorization } from '@wish-wash.biscuits/verdant';
import { useListContext } from './ListContext.jsx';

export interface CreateItemProps {}

export function CreateItem({}: CreateItemProps) {
  const { listId, list } = useListContext();
  const client = hooks.useClient();

  return (
    <FormikForm
      initialValues={{ description: '' }}
      onSubmit={async (values, form) => {
        let description = values.description;
        let link: string | null = null;
        if (isUrl(values.description)) {
          link = values.description;
          description = 'Web item';
        }

        const item = await client.items.put(
          {
            listId,
            description,
            link,
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
        placeholder="An idea, or a URL..."
      />
      <SubmitButton>Add</SubmitButton>
    </FormikForm>
  );
}
