import { hooks } from '@/store.js';
import { Button, ButtonProps } from '@a-type/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogClose,
} from '@a-type/ui/components/dialog';
import {
  FormikForm,
  TextField,
  SubmitButton,
} from '@a-type/ui/components/forms';
import { Icon } from '@a-type/ui/components/icon';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
import { toast } from '@a-type/ui';

export interface ListDetailsDialogProps {}

export function ListDetailsDialog({}: ListDetailsDialogProps) {
  const [params, setParams] = useSearchParams();
  const listId = params.get('listId');
  const list = hooks.useList(listId || '', { skip: !listId });
  hooks.useWatch(list);

  const onClose = () => {
    console.log('close');
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

export interface ListDetailsEditButtonProps extends ButtonProps {
  listId: string;
}

export function ListDetailsEditButton({
  listId,
  children,
  ...rest
}: ListDetailsEditButtonProps) {
  const [_, setParams] = useSearchParams();
  const onClick = () => {
    setParams((p) => {
      p.set('listId', listId);
      return p;
    });
  };

  return (
    <Button onClick={onClick} size="icon" color="ghost" {...rest}>
      {children || <Icon name="gear" />}
    </Button>
  );
}