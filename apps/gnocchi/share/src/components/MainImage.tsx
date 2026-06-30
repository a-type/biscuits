import { clsx } from '@a-type/ui';
import { TopLineImage } from './layout.jsx';
import cls from './MainImage.module.css';

export interface MainImageProps {
	url: string;
	title: string;
}

export function MainImage({ url, title }: MainImageProps) {
	return (
		<TopLineImage className={cls.root}>
			<img
				src={url}
				className={clsx('u-photo', cls.img)}
				alt={`A photo of ${title}`}
			/>
		</TopLineImage>
	);
}
