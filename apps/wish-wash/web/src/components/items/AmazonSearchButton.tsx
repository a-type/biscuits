import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { Link } from '@verdant-web/react-router';
import { Item } from '@wish-wash.biscuits/verdant';

export interface AmazonSearchButtonProps {
  item: Item;
}

export function AmazonSearchButton({ item }: AmazonSearchButtonProps) {
  const { description } = hooks.useWatch(item);

  return (
    <Button asChild>
      <Link
        to={`https://www.amazon.com/s?k=${encodeURIComponent(description)}`}
        newTab
      >
        <Icon name="scan" />
        Amazon
      </Link>
    </Button>
  );
}
