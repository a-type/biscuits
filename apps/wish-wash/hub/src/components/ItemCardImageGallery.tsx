import { HubWishlistItem } from '@/types.js';
import { clsx, Masonry } from '@a-type/ui';

export interface ItemCardImageGalleryProps {
	item: HubWishlistItem;
	className?: string;
	maxCols?: number;
}

export function ItemCardImageGallery({
	item,
	className,
	maxCols = 3,
}: ItemCardImageGalleryProps) {
	return (
		<Masonry
			className={clsx('w-full', className)}
			columns={() => {
				return Math.min(item.imageUrls.length, maxCols);
			}}
		>
			{item.imageUrls.map((url, i) => (
				<img
					key={i}
					className="w-full rounded-lg cursor-pointer"
					crossOrigin="anonymous"
					src={url}
				/>
			))}
		</Masonry>
	);
}
