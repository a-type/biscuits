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
}

export function ItemCardImageGallery({
	item: itemMasked,
	className,
}: ItemCardImageGalleryProps) {
	const item = readFragment(itemCardImageGalleryFragment, itemMasked);
	return (
		<Box
			p
			gap
			items="center"
			className={clsx(
				'w-full justify-center-safe overflow-y-auto',
				'grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
				className,
			)}
			border
			surface
		>
			{item.imageUrls.map((url, i) => (
				<img
					key={i}
					className="h-auto min-w-200px w-full flex-shrink-1 flex-grow-1 flex-basis-200px cursor-pointer rounded-lg object-contain"
					crossOrigin="anonymous"
					src={url}
				/>
			))}
		</Box>
	);
}
