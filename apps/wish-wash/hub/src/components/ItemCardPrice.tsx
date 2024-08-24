import { HubWishlistItem } from '@/types.js';
import { Card } from '@a-type/ui/components/card';

export interface ItemCardPriceProps {
  item: HubWishlistItem;
  className?: string;
}

export function ItemCardPrice({ item, className }: ItemCardPriceProps) {
  const priceDisplay =
    item.priceMin && item.priceMax
      ? `${item.priceMin} - ${item.priceMax}`
      : item.priceMin ?? item.priceMax;

  return (
    <Card.Content className={className}>
      <span className="text-md font-bold">{priceDisplay}</span>
    </Card.Content>
  );
}
