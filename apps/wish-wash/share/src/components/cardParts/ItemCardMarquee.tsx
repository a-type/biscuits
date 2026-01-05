import { Card, Marquee } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardMarqueeFragment = graphql(`
	fragment ItemCardMarquee on PublicWishlistItem {
		id
		imageUrls
		description
	}
`);

export interface ItemCardMarqueeProps {
	item: FragmentOf<typeof itemCardMarqueeFragment>;
}

export function ItemCardMarquee({ item: itemMasked }: ItemCardMarqueeProps) {
	const item = readFragment(itemCardMarqueeFragment, itemMasked);
	if (item.imageUrls.length === 0) {
		return null;
	}

	return (
		<Card.Image>
			<Marquee>
				{item.imageUrls.map((url) => (
					<Marquee.Item
						key={url}
						render={
							<img
								crossOrigin="anonymous"
								src={url}
								alt={'Picture of ' + item.description}
								className="object-cover"
							/>
						}
					/>
				))}
			</Marquee>
		</Card.Image>
	);
}
