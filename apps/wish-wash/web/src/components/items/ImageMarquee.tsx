import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { EntityFile } from '@wish-wash.biscuits/verdant';
import { useEffect, useState } from 'react';

export interface ImageMarqueeProps {
  images: EntityFile[];
  className?: string;
}

/**
 * Automatically flips through a list of images.
 */
export function ImageMarquee({ images, className }: ImageMarqueeProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const offset = `${currentImageIndex * -100}%`;

  // Automatically switch to the next image every 5 seconds
  useEffect(() => {
    const timeout = setTimeout(
      () => setCurrentImageIndex((currentImageIndex + 1) % images.length),
      5000,
    );
    return () => clearTimeout(timeout);
  }, [currentImageIndex, images.length]);

  return (
    <div
      className={clsx(
        'relative overflow-hidden layer-components:w-full layer-components:h-full',
        className,
      )}
    >
      <div
        className="absolute top-0 left-0 h-full w-full overflow-visible flex flex-row transition-transform duration-300"
        style={{ transform: `translateX(${offset})` }}
      >
        {images.map((image, i) => (
          <ImageMarqueeItem
            key={image.id}
            image={image}
            className="w-full h-full flex-shrink-0 object-cover"
          />
        ))}
      </div>
    </div>
  );
}

function ImageMarqueeItem({
  image,
  className,
}: {
  image: EntityFile;
  className?: string;
}) {
  hooks.useWatch(image);

  return (
    <img
      src={image.url ?? ''}
      alt={image.name ?? undefined}
      className={className}
    />
  );
}
