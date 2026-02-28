import { useRender, UseRenderComponentProps, withClassName } from '@a-type/ui';
import { FC } from 'react';

function GSlot({ render, ...rest }: UseRenderComponentProps<'g'>) {
	return useRender({
		defaultTagName: 'g',
		props: rest,
		render,
	});
}

export const Unzoomed: FC<UseRenderComponentProps<'g'>> = withClassName(
	GSlot,
	'scale-[calc(1/var(--zoom-settled))]',
);
