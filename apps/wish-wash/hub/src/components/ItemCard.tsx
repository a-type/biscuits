import { HubWishlistItem } from '@/types.js';
import { ItemCardMarquee } from './ItemCardMarquee.jsx';
import { Card } from '@a-type/ui/components/card';
import { ProductCardContent } from './ProductCardContent.jsx';
import { IdeaCardContent } from './IdeaCardContent.jsx';

export interface ItemCardProps {
  item: HubWishlistItem;
  className?: string;
  listAuthor: string;
}

export function ItemCard({ item, listAuthor, className }: ItemCardProps) {
  return (
    <Card className={className}>
      <ItemCardMarquee item={item} />
      <ItemCardContent item={item} listAuthor={listAuthor} />
    </Card>
  );
}

function ItemCardContent({ item, ...rest }: ItemCardProps) {
  switch (item.type) {
    case 'product':
      return <ProductCardContent item={item} {...rest} />;
    case 'idea':
      return <IdeaCardContent item={item} {...rest} />;
  }

  return null;
}
