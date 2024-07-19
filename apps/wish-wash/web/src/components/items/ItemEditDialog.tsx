import { useSearchParams } from '@verdant-web/react-router';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogClose,
} from '@a-type/ui/components/dialog';
import { hooks } from '@/hooks.js';
import { Item } from '@wish-wash.biscuits/verdant';
import { Input } from '@a-type/ui/components/input/Input';
import { TextArea } from '@a-type/ui/components/textArea/TextArea';
import { Button } from '@a-type/ui/components/button';
import { preventDefault } from '@a-type/utils';
import { ImageUploader } from '@a-type/ui/components/imageUploader';
import { ItemExpirationEditor } from './ItemExpirationEditor.jsx';

export interface ItemEditDialogProps {}

export function ItemEditDialog({}: ItemEditDialogProps) {
  const [search, setSearch] = useSearchParams();

  const itemId = search.get('itemId');

  const item = hooks.useItem(itemId || '', { skip: !itemId });

  return (
    <Dialog
      open={!!item}
      onOpenChange={(o) => {
        if (!o) {
          setSearch((p) => {
            p.delete('itemId');
            return p;
          });
        }
      }}
    >
      <DialogContent onOpenAutoFocus={preventDefault}>
        <DialogTitle>Edit item</DialogTitle>
        <span className="text-xxs italic text-gray-5 pb-2">
          All fields save automatically
        </span>
        {item && <ItemEditor item={item} />}
        <DialogActions>
          <DialogClose asChild>
            <Button color="primary">Done</Button>
          </DialogClose>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

function ItemEditor({ item }: { item: Item }) {
  const { description, link, imageFile, imageUrl } = hooks.useWatch(item);
  hooks.useWatch(imageFile);
  const finalImageUrl = imageFile?.url || imageUrl;

  return (
    <div className="col w-full items-stretch">
      <label>Image</label>
      <ImageUploader
        className="w-full h-[200px] rounded-lg"
        value={finalImageUrl}
        onChange={(file) => item.set('imageFile', file)}
      />
      <label htmlFor="description">Description</label>
      <TextArea
        id="description"
        value={description}
        onChange={(e) => item.set('description', e.currentTarget.value)}
        autoSelect
      />
      <label htmlFor="link">Link</label>
      <Input
        id="link"
        value={link || ''}
        type="url"
        onChange={(e) => item.set('link', e.currentTarget.value)}
        autoSelect
      />
      <ItemExpirationEditor item={item} />
    </div>
  );
}
