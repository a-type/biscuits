import { Card, Note } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardNoteFragment = graphql(`
	fragment ItemCardNote on PublishedWishlistItem {
		id
		note
	}
`);

export interface ItemCardNoteProps {
	className?: string;
	item: FragmentOf<typeof itemCardNoteFragment>;
}

export function ItemCardNote({
	item: itemMasked,
	className,
}: ItemCardNoteProps) {
	const item = readFragment(itemCardNoteFragment, itemMasked);
	if (!item.note) return null;

	return (
		<Card.Content unstyled className={className}>
			<Note>{item.note}</Note>
		</Card.Content>
	);
}
