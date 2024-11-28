import { HubWishlistItem } from '@/types.js';
import { CardGrid } from '@a-type/ui';
import { ItemCard } from './ItemCard.jsx';

export interface ItemsProps {
	items: HubWishlistItem[];
	listAuthor: string;
}

export function Items({ items, listAuthor }: ItemsProps) {
	return (
		<CardGrid className="flex-1">
			{items.map((item, i) => (
				<ItemCard key={item.id} item={item} listAuthor={listAuthor} />
			))}
		</CardGrid>
	);
}
