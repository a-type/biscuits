import { Card, clsx } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { ReactNode } from 'react';

export const itemCardMainFragment = graphql(`
	fragment ItemCardMain on PublishedWishlistItem {
		id
		imageUrls
	}
`);

export interface ItemCardMainProps {
	item: FragmentOf<typeof itemCardMainFragment>;
	children: ReactNode;
	className?: string;
}

export function ItemCardMain({
	item: itemMasked,
	children,
	className,
	...rest
}: ItemCardMainProps) {
	const item = readFragment(itemCardMainFragment, itemMasked);
	const hasImage = item.imageUrls.length > 0;

	return (
		<Card.Main
			className={clsx(hasImage && 'min-h-[300px]', className)}
			{...rest}
		>
			{children}
		</Card.Main>
	);
}
