import { Card, clsx } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardTitleFragment = graphql(`
	fragment ItemCardTitle on PublishedWishlistItem {
		id
		imageUrls
		description
		prioritized
	}
`);

export interface ItemCardTitleProps {
	item: FragmentOf<typeof itemCardTitleFragment>;
	className?: string;
}

export function ItemCardTitle({
	item: itemMasked,
	className,
}: ItemCardTitleProps) {
	const item = readFragment(itemCardTitleFragment, itemMasked);
	const hasImage = item.imageUrls.length > 0;
	return (
		<Card.Content
			unstyled
			className={clsx(
				'p-1 font-bold',
				hasImage ?
					'bg-[rgba(0,0,0,0.5)] text-[white] px-md'
				:	'color-primary-dark',
				item.prioritized || hasImage ? 'text-xl' : 'text-lg',
				className,
			)}
		>
			<span>{item.description}</span>
		</Card.Content>
	);
}
