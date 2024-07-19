import { hooks } from '@/hooks.js';
import { Item } from '@wish-wash.biscuits/verdant';
import { Chip } from '@a-type/ui/components/chip';
import { Icon } from '@a-type/ui/components/icon';
import { RelativeTime } from '@a-type/ui/components/relativeTime';
import { Link } from '@verdant-web/react-router';

export interface ItemOldBadgeProps {
  item: Item;
}

export function ItemOldBadge({ item }: ItemOldBadgeProps) {
  const { expiresAt, createdAt, id } = hooks.useWatch(item);

  if (!expiresAt || expiresAt > Date.now()) {
    return null;
  }

  return (
    <Chip asChild>
      <Link to={`?itemId=${id}`}>
        <Icon name="clock" />
        <RelativeTime value={createdAt} />
      </Link>
    </Chip>
  );
}
