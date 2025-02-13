import { clsx } from '@a-type/ui';
import { TopLineImage } from './layout.jsx';

export interface MainImageProps {
	url: string;
	title: string;
}

export function MainImage({ url, title }: MainImageProps) {
	return (
		<TopLineImage className="block relative overflow-hidden">
			<img
				src={url}
				className={clsx(
					'u-photo',
					'object-cover object-center w-full h-full rounded-lg lg:h-auto lg:aspect-square',
				)}
				alt={`A photo of ${title}`}
			/>
		</TopLineImage>
	);
}
