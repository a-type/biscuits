import { HubWishlistItem } from '@/types.js';
import { Card, clsx } from '@a-type/ui';
import { ReactNode } from 'react';

export interface ItemCardMainProps {
	item: HubWishlistItem;
	children: ReactNode;
	className?: string;
}

export function ItemCardMain({
	item,
	children,
	className,
	...rest
}: ItemCardMainProps) {
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
