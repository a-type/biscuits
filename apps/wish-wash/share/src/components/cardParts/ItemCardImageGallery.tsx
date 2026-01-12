import { Box, clsx } from '@a-type/ui';
import { FragmentOf, graphql, readFragment } from '@biscuits/graphql';

export const itemCardImageGalleryFragment = graphql(`
	fragment ItemCardImageGallery on PublishedWishlistItem {
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
		<Box
			p
			gap
			items="center"
			className={clsx(
				'w-full overflow-y-auto justify-center-safe',
				'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
				className,
			)}
			border
			surface
		>
			{item.imageUrls.map((url, i) => (
				<img
					key={i}
					className="rounded-lg cursor-pointer h-auto w-full object-contain flex-basis-200px min-w-200px flex-shrink-1 flex-grow-1"
					crossOrigin="anonymous"
					src={url}
				/>
			))}
		</Box>
	);
}
