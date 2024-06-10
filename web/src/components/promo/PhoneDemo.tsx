import classNames from 'classnames';
import { useMemo } from 'react';
import './phone.css';

export interface PhoneDemoProps {
  src: string;
  direction?: 'left' | 'right';
  type?: 'video' | 'image';
  className?: string;
}

export function PhoneDemo({
  src,
  direction = 'left',
  type = 'video',
  className,
}: PhoneDemoProps) {
  const animationDelay = useMemo(() => {
    return `${(Math.random() * 3).toFixed(2)}s`;
  }, []);

  const Media = type === 'video' ? Video : 'img';

  return (
    <div
      className={classNames(
        'phone-wrapper max-h-100vw overflow-hidden px-2 py-8 flex items-center justify-center',
        className,
      )}
    >
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
        <Media
          src={src}
          className="w-full h-full object-center object-cover rounded-lg"
        />
      </div>
    </div>
  );
}

function Video({ src, className }: { src: string; className: string }) {
  return (
    <video autoPlay loop muted playsInline src={src} className={className} />
  );
}

export default PhoneDemo;
