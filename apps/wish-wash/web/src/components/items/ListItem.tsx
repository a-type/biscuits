import { Item } from '@wish-wash.biscuits/verdant';
import { Checkbox } from '@a-type/ui/components/checkbox';
import { hooks } from '@/store.js';
import { EditableText } from '@a-type/ui/components/editableText';
import { useSnapshot } from 'valtio';
import { createdItemState } from '../lists/state.js';
import {
  CardRoot,
  CardContent,
  CardMain,
  CardActions,
  CardFooter,
  CardTitle,
  CardImage,
  CardMenu,
} from '@a-type/ui/components/card';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogClose,
} from '@a-type/ui/components/dialog';
import { Link, useSearchParams } from '@verdant-web/react-router';
import { Button } from '@a-type/ui/components/button';
import { ReactNode, useState } from 'react';
import { Icon } from '@a-type/ui/components/icon';
import {
  FormikForm,
  SubmitButton,
  TextField,
} from '@a-type/ui/components/forms';
import { SearchButton } from './SearchButton.jsx';
import { clsx } from '@a-type/ui';
import { ItemStar } from './ItemStar.jsx';

export interface ListItemProps {
  item: Item;
}

export function ListItem({ item }: ListItemProps) {
  const { purchasedAt, description, link, id, imageFile, imageUrl } =
    hooks.useWatch(item);
  hooks.useWatch(imageFile);

  const [_, setSearch] = useSearchParams();
  const openEdit = () =>
    setSearch((s) => {
      s.set('itemId', id);
      return s;
    });

  const imageSrc = imageFile?.url || imageUrl;

  return (
    <CardRoot className={clsx(imageSrc && 'min-h-200px')}>
      {imageSrc && (
        <CardImage asChild>
          <img src={imageSrc} />
        </CardImage>
      )}
      <CardMain className="col items-start">
        <CardTitle>{description}</CardTitle>
        {purchasedAt && (
          <CardContent className="text-xxs italic text-gray-5 px-2 bg-gray-1 rounded">
            Purchased at {new Date(purchasedAt).toLocaleDateString()}
          </CardContent>
        )}
        <ItemStar item={item} className="absolute right-1 top-1" />
      </CardMain>
      <CardFooter className="items-center justify-between">
        <CardMenu className="ml-0 mr-auto">
          <Button
            color="ghost"
            size="icon"
            onClick={openEdit}
            className="mr-auto"
          >
            <Icon name="pencil" />
          </Button>
        </CardMenu>
        <CardActions className="ml-auto mr-0">
          {link ? (
            <Button asChild color="accent" size="small">
              <Link to={link} newTab>
                <Icon name="link" /> Visit
              </Link>
            </Button>
          ) : (
            <>
              <SearchButton item={item} />
            </>
          )}
          <Button
            toggled={!!purchasedAt}
            color={purchasedAt ? 'default' : 'primary'}
            toggleMode="indicator"
            onClick={() => {
              if (purchasedAt) {
                item.set('purchasedAt', null);
              } else {
                item.set('purchasedAt', Date.now());
              }
            }}
            size="small"
          >
            {purchasedAt ? 'Bought' : 'Buy'}
          </Button>
        </CardActions>
      </CardFooter>
    </CardRoot>
  );
}
