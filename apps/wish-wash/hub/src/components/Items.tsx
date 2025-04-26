import { HubWishlistItem } from '@/types.js';
import { CardGrid } from '@a-type/ui';
import { ItemCard } from './ItemCard.js';

export interface ItemsProps {
	items: HubWishlistItem[];
	listAuthor: string;
	className?: string;
}

export function Items({ items, listAuthor, className }: ItemsProps) {
	return (
		<CardGrid
			className={className}
			columns={(w) => {
				if (w < 600) return 2;
				if (w < 800) return 3;
				if (w < 1000) return 4;
				return 5;
			}}
		>
			{items.map((item, i) => (
				<ItemCard key={item.id} item={item} listAuthor={listAuthor} />
			))}
		</CardGrid>
	);
}
