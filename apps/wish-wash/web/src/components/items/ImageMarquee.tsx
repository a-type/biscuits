import { hooks } from '@/hooks.js';
import { Marquee } from '@a-type/ui';
import { EntityFile } from '@wish-wash.biscuits/verdant';

export interface ImageMarqueeProps {
	images: readonly EntityFile[];
	className?: string;
}

/**
 * Automatically flips through a list of images.
 */
export function ImageMarquee({ images, ...rest }: ImageMarqueeProps) {
	return (
		<Marquee {...rest}>
			{images.map((image) => (
				<ImageMarqueeItem key={image.id} image={image} />
			))}
		</Marquee>
	);
}

function ImageMarqueeItem({ image }: { image: EntityFile }) {
	hooks.useWatch(image);

	return (
		<Marquee.Item
			render={
				<img
					src={image.url ?? ''}
					alt={image.name ?? undefined}
					className="object-cover"
				/>
			}
		/>
	);
}
