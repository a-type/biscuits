import { withClassName } from '@a-type/ui';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';

export const TitleAndImageLayout = withClassName(
	'div',
	classNames(
		'grid grid-cols-[1fr] grid-rows-[repeat(2,auto)] grid-areas-[image]-[title] w-full items-stretch gap-4',
		'lg:(grid-cols-[1fr_auto] grid-rows-[1fr] grid-areas-[title_image] items-start gap-4)',
	),
);

export const TitleContainer = withClassName(
	'div',
	'[grid-area:title] flex flex-col items-start gap-4 min-w-300px',
);

export const ImageContainer = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={classNames(
				'[grid-area:image] h-300px w-full lg:(h-200px w-200px)',
				className,
			)}
			{...props}
		/>
	);
};
