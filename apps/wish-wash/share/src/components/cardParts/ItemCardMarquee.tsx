import { Card, Img, Marquee } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardMarqueeFragment = graphql(`
	fragment ItemCardMarquee on PublishedWishlistItem {
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
							<Img
								fit="cover"
								crossOrigin="anonymous"
								src={url}
								alt={'Picture of ' + item.description}
							/>
						}
					/>
				))}
			</Marquee>
		</Card.Image>
	);
}
