import { clsx } from '@a-type/ui';

export const TopLineRoot = (props: any) => (
	<div
		className={clsx(
			'grid grid-areas-[image]-[title] grid-cols-[1fr] grid-rows-[auto_1fr] mb-6 gap-4',
			'md:grid-areas-[title_image] md:grid-cols-[1fr_auto]',
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
			'[grid-area:image] w-full h-30dvh md:w-full md:w-200px md:h-auto',
			props.className,
		)}
	/>
);
