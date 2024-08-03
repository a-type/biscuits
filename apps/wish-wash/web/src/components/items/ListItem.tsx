import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { Button } from '@a-type/ui/components/button';
import {
  CardActions,
  CardContent,
  CardFooter,
  CardImage,
  CardMain,
  CardMenu,
  CardRoot,
  CardTitle,
} from '@a-type/ui/components/card';
import { Icon } from '@a-type/ui/components/icon';
import { Link } from '@verdant-web/react-router';
import { Item } from '@wish-wash.biscuits/verdant';
import { ItemStar } from './ItemStar.jsx';
import { SearchButton } from './SearchButton.jsx';
import { useEditItem } from './hooks.js';

export interface ListItemProps {
  item: Item;
}

export function ListItem({ item }: ListItemProps) {
  const { purchasedAt, description, link, id, imageFile, imageUrl } =
    hooks.useWatch(item);

  hooks.useWatch(imageFile);

  const editItem = useEditItem();

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
            onClick={() => editItem(id)}
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
