import {
  FormikForm,
  SubmitButton,
  TextField,
} from '@a-type/ui/components/forms';
import { useListContext } from './ListContext.jsx';
import { createdItemState } from './state.js';

export interface CreateItemProps {}

export function CreateItem({}: CreateItemProps) {
  const { listId, client } = useListContext();

  return (
    <FormikForm
      initialValues={{ description: '' }}
      onSubmit={async (values, form) => {
        const item = await client.items.put({
          listId,
          description: values.description,
        });
        // actually don't need to focus edit on this since we just
        // named it...
        // createdItemState.justCreatedId = item.get('id');
        form.resetForm();
      }}
      className="!row items-center gap-2"
    >
      <TextField name="description" required className="flex-1" />
      <SubmitButton>Add</SubmitButton>
    </FormikForm>
  );
}
