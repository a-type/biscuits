import { clsx, Masonry } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardImageGalleryFragment = graphql(`
	fragment ItemCardImageGallery on PublicWishlistItem {
		id
		imageUrls
	}
`);

export interface ItemCardImageGalleryProps {
	item: FragmentOf<typeof itemCardImageGalleryFragment>;
	className?: string;
	maxCols?: number;
}

export function ItemCardImageGallery({
	item: itemMasked,
	className,
	maxCols = 3,
}: ItemCardImageGalleryProps) {
	const item = readFragment(itemCardImageGalleryFragment, itemMasked);
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
