import { useMemo } from 'react';

export interface PhoneDemoProps {
  src: string;
}

export function PhoneDemo({ src }: PhoneDemoProps) {
  const animationDelay = useMemo(() => {
    return `${(Math.random() * 3).toFixed(2)}s`;
  }, []);

  return (
    <div className="phone-wrapper">
      <div
        className="phone border-4 border-black border-solid rounded-lg aspect-ratio-11/24 bg-black"
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
