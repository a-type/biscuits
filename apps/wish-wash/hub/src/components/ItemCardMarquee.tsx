import { HubWishlistItem } from '@/types.js';
import { Card, Marquee } from '@a-type/ui';

export interface ItemCardMarqueeProps {
	item: HubWishlistItem;
}

export function ItemCardMarquee({ item }: ItemCardMarqueeProps) {
	if (item.imageUrls.length === 0) {
		return null;
	}

	return (
		<Card.Image>
			<Marquee>
				{item.imageUrls.map((url, i) => (
					<Marquee.Item asChild>
						<img
							crossOrigin="anonymous"
							src={url}
							alt={'Picture of ' + item.description}
							className="object-cover"
						/>
					</Marquee.Item>
				))}
			</Marquee>
		</Card.Image>
	);
}
