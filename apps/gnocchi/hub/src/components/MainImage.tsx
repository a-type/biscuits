import { clsx } from '@a-type/ui';
import { TopLineImage } from './layout.jsx';

export interface MainImageProps {
	url: string;
	title: string;
}

export function MainImage({ url, title }: MainImageProps) {
	return (
		<TopLineImage className="block relative w-full h-30dvh rounded-lg overflow-hidden">
			<img
				src={url}
				className={clsx('u-photo', 'object-cover object-center w-full h-full')}
				alt={`A photo of ${title}`}
			/>
		</TopLineImage>
	);
}
