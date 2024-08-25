import React from 'react';
import { HubWishlistItem } from '@/types.js';
import { CardImage } from '@a-type/ui/components/card';
import { Marquee } from '@a-type/ui/components/marquee';

export interface ItemCardMarqueeProps {
  item: HubWishlistItem;
}

export function ItemCardMarquee({ item }: ItemCardMarqueeProps) {
  if (item.imageUrls.length === 0) {
    return null;
  }

  return (
    <CardImage>
      <Marquee>
        {item.imageUrls.map((url, i) => (
          <Marquee.Item asChild>
            <img
              src={url}
              alt={'Picture of ' + item.description}
              className="object-cover"
            />
          </Marquee.Item>
        ))}
      </Marquee>
    </CardImage>
  );
}
