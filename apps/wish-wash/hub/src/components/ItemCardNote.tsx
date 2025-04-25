import { HubWishlistItem } from '@/types.js';
import { Card, Note } from '@a-type/ui';

export interface ItemCardNoteProps {
	className?: string;
	item: HubWishlistItem;
}

export function ItemCardNote({ item, className }: ItemCardNoteProps) {
	if (!item.note) return null;

	return (
		<Card.Content unstyled className={className}>
			<Note>{item.note}</Note>
		</Card.Content>
	);
}
