import { useSnapshot } from 'valtio';
import { shareTargetState } from './shareTargetState.js';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogClose,
  DialogSelectItem,
  DialogSelectList,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { hooks } from '@/store.js';
import { useNavigate } from '@verdant-web/react-router';
import { Icon } from '@a-type/ui/components/icon';

export interface ShareTargetListPickerProps {}

export function ShareTargetListPicker({}: ShareTargetListPickerProps) {
  const share = useSnapshot(shareTargetState).share;

  const show = !!share;

  const client = hooks.useClient();
  const navigate = useNavigate();
  const addToList = async (listId: string) => {
    if (!share) return;
    await client.items.put({
      listId,
      link: share.url,
      description: share.title || share.text,
    });
    navigate(`/${listId}`);
  };

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          shareTargetState.share = null;
        }
      }}
    >
      <DialogContent>
        <DialogTitle>Add to list</DialogTitle>
        <DialogSelectList onValueChange={addToList}>
          {show && <ListItems />}
        </DialogSelectList>
      </DialogContent>
    </Dialog>
  );
}

const ListItems = () => {
  const lists = hooks.useAllLists();

  return (
    <>
      {lists.map((list) => (
        <DialogSelectItem value={list.get('id')} key={list.get('id')}>
          <Icon name={list.isAuthorized ? 'lock' : 'add_person'} />
          {list.get('name')}
        </DialogSelectItem>
      ))}
    </>
  );
};
