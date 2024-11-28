import { hooks } from '@/hooks.js';
import { Chip, Icon, RelativeTime } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { Item } from '@wish-wash.biscuits/verdant';

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
