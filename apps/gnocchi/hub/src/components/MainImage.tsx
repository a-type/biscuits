import { TopLineImage } from './layout.jsx';
import { clsx } from '@a-type/ui';

export interface MainImageProps {
  url: string;
  title: string;
}

export function MainImage({ url, title }: MainImageProps) {
  return (
    <TopLineImage className="block relative w-full h-30vh rounded-lg overflow-hidden">
      <img
        src={url}
        className={clsx('u-photo', 'object-cover object-center')}
        alt={`A photo of ${title}`}
      />
    </TopLineImage>
  );
}
