import { hooks } from '@/hooks.js';
import { Marquee } from '@a-type/ui/components/marquee';
import { EntityFile } from '@wish-wash.biscuits/verdant';

export interface ImageMarqueeProps {
  images: EntityFile[];
  className?: string;
}

/**
 * Automatically flips through a list of images.
 */
export function ImageMarquee({ images, className }: ImageMarqueeProps) {
  return (
    <Marquee>
      {images.map((image, i) => (
        <ImageMarqueeItem key={image.id} image={image} />
      ))}
    </Marquee>
  );
}

function ImageMarqueeItem({ image }: { image: EntityFile }) {
  hooks.useWatch(image);

  return (
    <Marquee.Item asChild>
      <img
        src={image.url ?? ''}
        alt={image.name ?? undefined}
        className="object-cover"
      />
    </Marquee.Item>
  );
}
