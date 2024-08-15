import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { Button } from '@a-type/ui/components/button';
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@a-type/ui/components/dialog';
import { Icon } from '@a-type/ui/components/icon';
import { ImageUploader } from '@a-type/ui/components/imageUploader';
import { Input } from '@a-type/ui/components/input/Input';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import { ScrollArea } from '@a-type/ui/components/scrollArea/ScrollArea';
import { TextArea } from '@a-type/ui/components/textArea/TextArea';
import { withClassName } from '@a-type/ui/hooks';
import { preventDefault } from '@a-type/utils';
import { graphql, useHasServerAccess, useLazyQuery } from '@biscuits/client';
import { useSearchParams } from '@verdant-web/react-router';
import {
  Item,
  List,
  ListItemsItemImageFilesDestructured,
} from '@wish-wash.biscuits/verdant';
import { ReactNode, useCallback } from 'react';

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

  return <div className="col w-full items-stretch">{content}</div>;
}

function IdeaEditor({ item }: { item: Item }) {
  return (
    <>
      <ImagesField item={item} />
      <DescriptionField item={item} />
      <PriceRangeField item={item} />
      <CountField item={item} />
    </>
  );
}

function ProductEditor({ item }: { item: Item }) {
  return (
    <>
      <RemoteImage item={item} />
      <SingleLinkField item={item} />
      <DescriptionField item={item} label="What is it?" />
      <PriceField item={item} />
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

const scanPage = graphql(`
  query ScanStorePage($url: String!) {
    storePageScan(input: { url: $url }) {
      priceString
      productName
      scanner
      imageUrl
    }
  }
`);

function SingleLinkField({ item }: { item: Item }) {
  const { links } = hooks.useWatch(item);
  hooks.useWatch(links);
  const firstLink = links.get(0) ?? null;

  const subscribed = useHasServerAccess();
  const [doScan, { loading: scanning }] = useLazyQuery(scanPage);
  const maybeScanPage = useCallback(async () => {
    if (!subscribed) return;

    const result = await doScan({
      variables: {
        url: firstLink,
      },
    });
    if (result.data?.storePageScan) {
      const scan = result.data.storePageScan;
      console.log('scan result', scan);
      item.update({
        description: scan.productName ?? undefined,
        priceMin: scan.priceString ?? undefined,
        remoteImageUrl: scan.imageUrl ?? undefined,
      });
    } else {
      console.error('scan failed', result.error);
    }
  }, [firstLink, item, subscribed]);

  return (
    <>
      <Label htmlFor="link">Link</Label>
      <Input
        id="link"
        value={links.get(0) || ''}
        type="url"
        onChange={(e) => links.set(0, e.currentTarget.value)}
        onBlur={maybeScanPage}
        autoSelect
      />
      {!!scanning && (
        <span className="text-xs text-gray-7 pl-3">
          <Icon name="refresh" className="animate-spin w-10px h-10px" />{' '}
          Scanning page...
        </span>
      )}
    </>
  );
}

const Label = withClassName('label', 'font-bold text-sm text-gray-7 py-1');

function PriceRangeField({ item }: { item: Item }) {
  const priceMinField = hooks.useField(item, 'priceMin');
  const priceMaxField = hooks.useField(item, 'priceMax');

  return (
    <>
      <Label htmlFor="priceMin">Price range</Label>
      <div className="row">
        <Input
          id="priceMin"
          {...priceMinField.inputProps}
          value={priceMinField.inputProps.value ?? ''}
          placeholder="$10"
          className="w-1/2"
        />
        <span className="px-2">to</span>
        <Input
          id="priceMax"
          {...priceMaxField.inputProps}
          value={priceMaxField.inputProps.value ?? ''}
          placeholder="$100"
          className="w-1/2"
        />
      </div>
    </>
  );
}

function PriceField({ item }: { item: Item }) {
  const priceField = hooks.useField(item, 'priceMin');

  return (
    <>
      <Label htmlFor="price">Price</Label>
      <Input
        id="price"
        {...priceField.inputProps}
        value={priceField.inputProps.value ?? ''}
        placeholder="$10"
      />
    </>
  );
}

function RemoteImage({ item }: { item: Item }) {
  const { remoteImageUrl } = hooks.useWatch(item);

  if (!remoteImageUrl) return null;

  return (
    <img
      src={remoteImageUrl}
      alt="product image"
      className="h-200px object-cover object-center"
    />
  );
}
