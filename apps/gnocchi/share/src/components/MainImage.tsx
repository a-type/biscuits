import { clsx } from '@a-type/ui';
import { TopLineImage } from './layout.jsx';

export interface MainImageProps {
	url: string;
	title: string;
}

export function MainImage({ url, title }: MainImageProps) {
	return (
		<TopLineImage className="relative block overflow-hidden">
			<img
				src={url}
				className={clsx(
					'u-photo',
					'h-full w-full rounded-lg object-cover object-center md:aspect-square md:h-auto',
				)}
				alt={`A photo of ${title}`}
			/>
		</TopLineImage>
	);
}
