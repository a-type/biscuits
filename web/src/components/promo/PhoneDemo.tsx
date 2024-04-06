import classNames from 'classnames';
import { useMemo } from 'react';

export interface PhoneDemoProps {
  src: string;
  direction?: 'left' | 'right';
}

export function PhoneDemo({ src, direction = 'left' }: PhoneDemoProps) {
  const animationDelay = useMemo(() => {
    return `${(Math.random() * 3).toFixed(2)}s`;
  }, []);

  return (
    <div className="phone-wrapper max-h-100vw overflow-hidden px-2 py-8 flex items-center justify-center">
      <div
        className={classNames(
          'phone rounded-lg aspect-ratio-11/24 max-h-90vw bg-[black] min-h-0',
          direction,
        )}
        style={{
          animationDelay,
        }}
      >
        <div className="absolute z--1 left-0 w-full h-full flex items-center justify-center text-gray-5 font-fancy text-lg p-6 text-center">
          Video Coming Soon
        </div>
        <video
          autoPlay
          loop
          muted
          playsInline
          src={src}
          className="w-full h-full object-center object-cover rounded-lg"
        />
      </div>
    </div>
  );
}

export default PhoneDemo;
