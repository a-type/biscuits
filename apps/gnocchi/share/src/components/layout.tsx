import { clsx } from '@a-type/ui';

export const TopLineRoot = (props: any) => (
	<div
		className={clsx(
			'grid grid-cols-[1fr] grid-rows-[auto_1fr] grid-areas-[image]-[title] mb-6 gap-4',
			'md:grid-cols-[1fr_auto] md:grid-areas-[title_image]',
		)}
		{...props}
	/>
);

export const TopLineTitle = (props: any) => (
	<div className={clsx('[grid-area:title] flex flex-col gap-2')} {...props} />
);

export const TopLineImage = (props: any) => (
	<div
		{...props}
		className={clsx(
			'[grid-area:image] h-30dvh w-full md:h-auto md:w-200px',
			props.className,
		)}
	/>
);
