import { useRender, UseRenderComponentProps, withClassName } from '@a-type/ui';

function GSlot({ render, ...rest }: UseRenderComponentProps<'g'>) {
	return useRender({
		defaultTagName: 'g',
		props: rest,
		render,
	});
}

export const Unzoomed = withClassName(
	GSlot,
	'scale-[calc(1/var(--zoom-settled))]',
);
