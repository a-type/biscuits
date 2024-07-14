import { hooks } from '@/store.js';
import { ButtonProps, Button } from '@a-type/ui/components/button';
import {
  Dialog,
  DialogTrigger,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { Icon } from '@a-type/ui/components/icon';
import { useCanSync } from '@biscuits/client';
import { useNavigate } from '@verdant-web/react-router';
import { authorization } from '@wish-wash.biscuits/verdant';
import { useState } from 'react';

export interface CreateListButtonProps extends ButtonProps {}

export function CreateListButton({
  children,
  ...props
}: CreateListButtonProps) {
  const client = hooks.useClient();
  const navigate = useNavigate();

  const canSync = useCanSync();

  const [open, setOpen] = useState(false);

  const createPublic = async () => {
    const list = await client.lists.put({});
    navigate(`/${list.get('id')}?listId=${list.get('id')}`);
    setOpen(false);
  };
  const createPrivate = async () => {
    const list = await client.lists.put(
      {},
      {
        access: authorization.private,
      },
    );
    navigate(`/${list.get('id')}?listId=${list.get('id')}`);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          if (!canSync) {
            createPrivate();
          } else {
            setOpen(true);
          }
        } else {
          setOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button {...props}>
          {children || (
            <>
              <Icon name="plus" />
              New List
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create List</DialogTitle>
        {canSync && <Button onClick={createPublic}>New Public List</Button>}
        <Button onClick={createPrivate}>New Private List</Button>
        <DialogActions>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
