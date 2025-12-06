import { Card, clsx } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';
import { typeThemes } from '@wish-wash.biscuits/common';
import {
	ItemCardActions,
	itemCardActionsFragment,
} from './cardParts/ItemCardActions.js';
import {
	ItemCardMarquee,
	itemCardMarqueeFragment,
} from './cardParts/ItemCardMarquee.js';
import {
	ItemCardStar,
	itemCardStarFragment,
} from './cardParts/ItemCardStar.js';
import { IdeaCardContent, ideaCardContentFragment } from './IdeaCardContent.js';
import {
	ProductCardContent,
	productCardContentFragment,
} from './ProductCardContent.js';
import { VibeCardContent, vibeCardContentFragment } from './VibeCardContent.js';

export const itemCardFragment = graphql(
	`
		fragment ItemCard on PublicWishlistItem {
			id
			count
			purchasedCount
			prioritized
			type

			...ItemCardStar
			...ItemCardMarquee
			...IdeaCardContent
			...ProductCardContent
			...VibeCardContent
			...ItemCardActions
		}
	`,
	[
		itemCardStarFragment,
		itemCardMarqueeFragment,
		ideaCardContentFragment,
		productCardContentFragment,
		vibeCardContentFragment,
		itemCardActionsFragment,
	],
);

export interface ItemCardProps {
	item: FragmentOf<typeof itemCardFragment>;
	className?: string;
	listAuthor: string;
}

export function ItemCard({
	item: itemMasked,
	listAuthor,
	className,
}: ItemCardProps) {
	const item = readFragment(itemCardFragment, itemMasked);
	const boughtAll = item.count > 0 && item.purchasedCount >= item.count;

	return (
		<Card
			className={clsx(
				className,
				`theme-${typeThemes[item.type]}`,
				'bg-primary-wash color-primary-ink',
				boughtAll && 'opacity-50',
				item.prioritized && !boughtAll && 'min-h-200px sm:min-h-250px',
			)}
			data-span={item.prioritized && !boughtAll ? 2 : 1}
		>
			<ItemCardStar item={item} />
			<ItemCardMarquee item={item} />
			<ItemCardContent item={itemMasked} listAuthor={listAuthor} />
			{item.type === 'link' && (<Card.Footer>
				<ItemCardActions item={item} />
			</Card.Footer>)}
		</Card>
	);
}

function ItemCardContent({ item: itemMasked, ...rest }: ItemCardProps) {
	const item = readFragment(itemCardFragment, itemMasked);
	switch (item.type) {
		case 'link':
			return <ProductCardContent item={item} {...rest} />;
		case 'idea':
			return <IdeaCardContent item={item} {...rest} />;
		case 'vibe':
			return <VibeCardContent item={item} {...rest} />;
	}

	return null;
}
