import { HubWishlistItem } from '@/types.js';
import { CardGrid, cardGridColumns, clsx } from '@a-type/ui';
import { ItemCard } from './ItemCard.js';

export interface ItemsProps {
	items: HubWishlistItem[];
	listAuthor: string;
	className?: string;
}

export function Items({ items, listAuthor, className }: ItemsProps) {
	return (
		<CardGrid className={clsx(className)} columns={cardGridColumns.small}>
			{items.map((item, i) => (
				<ItemCard key={item.id} item={item} listAuthor={listAuthor} />
			))}
		</CardGrid>
	);
}
