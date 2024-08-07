import { useSearchParams } from '@verdant-web/react-router';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogClose,
} from '@a-type/ui/components/dialog';
import { hooks } from '@/hooks.js';
import {
  Item,
  List,
  ListItemsItemImageFilesDestructured,
  ListItemsItemImageFilesItem,
} from '@wish-wash.biscuits/verdant';
import { Input } from '@a-type/ui/components/input/Input';
import { TextArea } from '@a-type/ui/components/textArea/TextArea';
import { Button } from '@a-type/ui/components/button';
import { preventDefault } from '@a-type/utils';
import { ImageUploader } from '@a-type/ui/components/imageUploader';
import { ItemExpirationEditor } from './ItemExpirationEditor.jsx';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import { ReactNode } from 'react';
import { Icon } from '@a-type/ui/components/icon';
import { clsx } from '@a-type/ui';
import { withClassName } from '@a-type/ui/hooks';
import { ScrollArea } from '@a-type/ui/components/scrollArea/ScrollArea';

export interface ItemEditDialogProps {
  list: List;
}

export function ItemEditDialog({ list }: ItemEditDialogProps) {
  const [search, setSearch] = useSearchParams();

  const itemId = search.get('itemId');
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);

  const item = items.find((i) => i.get('id') === itemId);

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
  const { type } = hooks.useWatch(item);
  let content: ReactNode = null;
  switch (type) {
    case 'idea':
      content = <IdeaEditor item={item} />;
      break;
    case 'product':
      content = <ProductEditor item={item} />;
      break;
    case 'vibe':
      content = <VibeEditor item={item} />;
      break;
  }

  return (
    <div className="col w-full items-stretch">
      {content}
      <ItemExpirationEditor item={item} />
    </div>
  );
}

function IdeaEditor({ item }: { item: Item }) {
  return (
    <>
      <ImagesField item={item} />
      <DescriptionField item={item} />
      <CountField item={item} />
    </>
  );
}

function ProductEditor({ item }: { item: Item }) {
  return (
    <>
      <SingleLinkField item={item} />
      <DescriptionField item={item} label="What is it?" />
      <CountField item={item} />
    </>
  );
}

function VibeEditor({ item }: { item: Item }) {
  return (
    <>
      <ImagesField item={item} />
      <DescriptionField item={item} label="What's the vibe?" />
    </>
  );
}

function ImagesField({ item }: { item: Item }) {
  const { imageFiles } = hooks.useWatch(item);
  hooks.useWatch(imageFiles);

  return (
    <div>
      <ScrollArea background="white" className="max-h-400px w-full">
        <div className="grid sm:grid-cols-3 gap-1">
          {imageFiles.map((file, index) => (
            <ImageField
              key={file.id}
              file={file}
              onRemove={() => {
                imageFiles.removeAll(file);
              }}
            />
          ))}
        </div>
      </ScrollArea>
      <Label>Add images</Label>
      <ImageUploader
        value={null}
        onChange={(v) => {
          if (v) {
            imageFiles.push(v);
          }
        }}
        className="w-full h-200px rounded-lg"
      />
    </div>
  );
}

function ImageField({
  file,
  onRemove,
  className,
}: {
  file: ListItemsItemImageFilesDestructured[number];
  onRemove: () => void;
  className?: string;
}) {
  hooks.useWatch(file);

  return (
    <div className={clsx('relative', className)}>
      <img
        className="h-full w-full object-cover rounded-lg"
        src={file.url ?? ''}
      />
      <Button
        size="icon"
        color="destructive"
        className="absolute top-1 right-1"
        onClick={onRemove}
      >
        <Icon name="trash" />
      </Button>
    </div>
  );
}

function DescriptionField({
  item,
  label,
  placeholder,
}: {
  item: Item;
  label?: string;
  placeholder?: string;
}) {
  const descriptionField = hooks.useField(item, 'description');

  return (
    <>
      <Label htmlFor="description">{label ?? 'Description'}</Label>
      <TextArea
        id="description"
        {...descriptionField.inputProps}
        autoSelect
        placeholder={placeholder}
      />
    </>
  );
}

function CountField({ item }: { item: Item }) {
  const countField = hooks.useField(item, 'count');

  return (
    <>
      <Label htmlFor="count">How many do you want?</Label>
      <div className="row flex-wrap">
        <NumberStepper
          value={countField.value}
          onChange={countField.setValue}
          renderValue={(val) => (val === 0 ? '∞' : val)}
        />
      </div>
    </>
  );
}

function SingleLinkField({ item }: { item: Item }) {
  const { links } = hooks.useWatch(item);
  hooks.useWatch(links);

  return (
    <>
      <Label htmlFor="link">Link</Label>
      <Input
        id="link"
        value={links.get(0) || ''}
        type="url"
        onChange={(e) => links.set(0, e.currentTarget.value)}
        autoSelect
      />
    </>
  );
}

const Label = withClassName('label', 'font-bold text-sm text-gray-7 py-1');
