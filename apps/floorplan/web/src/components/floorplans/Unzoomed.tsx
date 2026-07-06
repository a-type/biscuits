import { useRender, UseRenderComponentProps, withClassName } from '@a-type/ui';
import { FC } from 'react';
import cls from './shape.module.css';

function GSlot({ render, ...rest }: UseRenderComponentProps<'g'>) {
	return useRender({
		defaultTagName: 'g',
		props: rest,
		render,
	});
}

export const Unzoomed: FC<UseRenderComponentProps<'g'>> = withClassName(
	GSlot,
	cls.scaleZoom,
);
