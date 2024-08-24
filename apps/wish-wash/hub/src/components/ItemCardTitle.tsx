import { HubWishlistItem } from '@/types.js';
import { Card } from '@a-type/ui/components/card';

export interface ItemCardTitleProps {
  item: HubWishlistItem;
  className?: string;
}

export function ItemCardTitle({ item, className }: ItemCardTitleProps) {
  return (
    <Card.Content className={className}>
      <span className="text-lg font-bold">{item.description}</span>
    </Card.Content>
  );
}
