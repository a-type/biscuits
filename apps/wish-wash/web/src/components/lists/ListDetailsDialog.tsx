import { hooks } from '@/hooks.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogClose,
} from '@a-type/ui/components/dialog';
import {
  DropdownMenuItem,
  DropdownMenuItemRightSlot,
} from '@a-type/ui/components/dropdownMenu';
import {
  FormikForm,
  TextField,
  SubmitButton,
} from '@a-type/ui/components/forms';
import { Icon } from '@a-type/ui/components/icon';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
import { toast } from '@a-type/ui';
import { UserMenuItem } from '@biscuits/client';
import { useEditList } from './hooks.js';

export interface ListDetailsDialogProps {}

export function ListDetailsDialog({}: ListDetailsDialogProps) {
  const [params, setParams] = useSearchParams();
  const listId = params.get('listId');

  const list = hooks.useList(listId || '', { skip: !listId });
  hooks.useWatch(list);

  const onClose = () => {
    setParams((p) => {
      p.delete('listId');
      return p;
    });
  };

  const navigate = useNavigate();
  const deleteList = async () => {
    if (list) {
      list.deleteSelf();
      toast.success('List deleted');
      navigate('/');
    }
  };

  return (
    <Dialog
      open={!!listId}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent>
        <FormikForm
          initialValues={{ name: list ? list.get('name') : '' }}
          onSubmit={async ({ name }) => {
            if (list) {
              list.set('name', name);
            }
            onClose();
          }}
        >
          <DialogTitle>Edit List</DialogTitle>
          <TextField name="name" required />
          <DialogActions>
            <Button
              type="button"
              color="destructive"
              onClick={deleteList}
              className="mr-auto"
            >
              <Icon name="trash" />
              Delete list
            </Button>
            <DialogClose asChild>
              <Button type="button">
                <Icon name="x" />
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton>
              <Icon name="check" /> Save
            </SubmitButton>
          </DialogActions>
        </FormikForm>
      </DialogContent>
    </Dialog>
  );
}

export interface ListDetailsEditButtonProps {
  listId: string;
  className?: string;
}

export function ListDetailsEditButton({
  listId,
  ...rest
}: ListDetailsEditButtonProps) {
  const editList = useEditList();
  return (
    <UserMenuItem onClick={() => editList(listId)} {...rest}>
      Edit list{' '}
      <DropdownMenuItemRightSlot>
        <Icon name="pencil" />
      </DropdownMenuItemRightSlot>
    </UserMenuItem>
  );
}
