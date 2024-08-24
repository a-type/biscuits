import { clsx } from '@a-type/ui';
import { SlotDiv } from '@a-type/ui/components/utility/SlotDiv';
import { withClassName } from '@a-type/ui/hooks';
import { Children, ReactNode, useEffect, useState } from 'react';

export interface MarqueeProps {
  className?: string;
  children?: ReactNode;
  timeout?: number;
}

export function Marquee({ className, children, timeout = 5000 }: MarqueeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const offset = `${currentIndex * -100}%`;

  const childCount = Children.count(children);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % childCount);
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, childCount, timeout]);

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
        {children}
      </div>
    </div>
  );
}

const MarqueeItem = withClassName(
  SlotDiv,
  'w-full h-full flex-shrink-0 object-cover',
);

Marquee.Item = MarqueeItem;
