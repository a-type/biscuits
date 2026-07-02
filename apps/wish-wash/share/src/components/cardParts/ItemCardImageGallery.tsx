import { Box, Img } from '@a-type/ui';
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
			full="width"
			justify="safe-center"
			overflow="auto-y"
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
			}}
			className={className}
			border
			surface
		>
			{item.imageUrls.map((url, i) => (
				<Img
					key={i}
					fit="contain"
					full="width"
					style={{
						minWidth: 200,
						flexGrow: 1,
						flexShrink: 1,
						flexBasis: 200,
						cursor: 'pointer',
						borderRadius: 'var(--m-radius-lg)',
					}}
					crossOrigin="anonymous"
					src={url}
				/>
			))}
		</Box>
	);
}
