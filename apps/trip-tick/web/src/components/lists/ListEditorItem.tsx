import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import {
  CardActions,
  CardContent,
  CardFooter,
  CardMain,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@a-type/ui/components/dialog';
import { Icon } from '@a-type/ui/components/icon';
import { ListItemsItem } from '@trip-tick.biscuits/verdant';
import { ListItemEditor } from './ListItemEditor.jsx';
import { getItemRulesLabel } from './utils.js';
import { useSearchParams } from '@verdant-web/react-router';

export interface ListEditorItemProps {
  item: ListItemsItem;
  onDelete: () => void;
}

export function ListEditorItem({ item, onDelete }: ListEditorItemProps) {
  const { id, description, conditions } = hooks.useWatch(item);
  hooks.useWatch(conditions);
  const shortString = getItemRulesLabel(item);
  const [params, setParams] = useSearchParams();
  const open = params.get('item') === id;
  const onClose = () =>
    setParams((p) => {
      p.delete('item');
      return p;
    });
  const onOpen = () =>
    setParams((p) => {
      p.set('item', id);
      return p;
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
        else onOpen();
      }}
    >
      <CardRoot>
        <DialogTrigger asChild>
          <CardMain>
            <CardTitle>{description}</CardTitle>
            <CardContent>{shortString}</CardContent>
          </CardMain>
        </DialogTrigger>
        <CardFooter>
          <CardActions>
            <Button size="icon" color="ghostDestructive" onClick={onDelete}>
              <Icon name="trash" />
            </Button>
          </CardActions>
        </CardFooter>
      </CardRoot>
      <DialogContent>
        <ListItemEditor item={item} />
        <DialogActions>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
