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
import { ItemTypeChip } from './ItemTypeChip.jsx';
import { Chip } from '@a-type/ui/components/chip';
import { ImageMarquee } from './ImageMarquee.jsx';
import { CSSProperties, forwardRef } from 'react';

export interface ListItemProps {
  item: Item;
  style?: CSSProperties;
  className?: string;
}

export const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  function ListItem({ item, className, ...rest }, ref) {
    const {
      purchasedCount,
      count,
      description,
      links,
      id,
      imageFiles,
      type,
      lastPurchasedAt,
      prioritized,
    } = hooks.useWatch(item);
    hooks.useWatch(links);
    hooks.useWatch(imageFiles);
    const link = links.get(0);

    const editItem = useEditItem();

    const purchased = purchasedCount > count;

    return (
      <CardRoot
        ref={ref}
        className={clsx(
          prioritized
            ? 'min-h-300px sm:min-h-40vw'
            : imageFiles.length
              ? 'min-h-300px'
              : '',
          className,
        )}
        data-span={prioritized ? 2 : 1}
        {...rest}
      >
        {imageFiles.length > 0 && (
          <CardImage>
            <ImageMarquee images={imageFiles.getAll()} />
          </CardImage>
        )}
        <CardMain className="col items-start">
          <CardTitle className="block">
            <ItemTypeChip className="mr-2" item={item} />
            {description}
          </CardTitle>
          <div className="p-2">
            {lastPurchasedAt && (
              <Chip className="text-xxs">
                Bought: {new Date(lastPurchasedAt).toLocaleDateString()}
              </Chip>
            )}
            {type === 'idea' ||
              (type === 'product' && !link && <SearchButton item={item} />)}
          </div>
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
            {link && (
              <Button asChild color="accent" size="small">
                <Link to={link} newTab>
                  <Icon name="link" /> View
                </Link>
              </Button>
            )}
            <Button
              toggled={!!purchased}
              color={purchased ? 'default' : 'primary'}
              toggleMode="indicator"
              onClick={() => {
                // TODO: Implement
              }}
              size="small"
            >
              {purchased ? 'Bought' : 'Buy'}
            </Button>
          </CardActions>
        </CardFooter>
      </CardRoot>
    );
  },
);
