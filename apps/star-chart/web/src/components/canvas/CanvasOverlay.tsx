import { clsx } from '@a-type/ui';
import { stopPropagation } from '@a-type/utils';
import { ReactNode } from 'react';
import { disableDragProps } from './CanvasObjectDragHandle.jsx';

export interface CanvasOverlayProps {
	className?: string;
	children?: ReactNode;
}

export function CanvasOverlay({
	className,
	children,
	...rest
}: CanvasOverlayProps) {
	return (
		<div
			className={clsx('absolute pointer-events-none inset-0', className)}
			{...disableDragProps}
			// prevent cancellation further down
			onContextMenu={stopPropagation}
			{...rest}
		>
			{children}
		</div>
	);
}

export function CanvasOverlayContent({
	children,
	className,
	...rest
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={clsx('pointer-events-auto', className)} {...rest}>
			{children}
		</div>
	);
}
