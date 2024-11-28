import { clsx } from '@a-type/ui';
import { createContext, useCallback, useRef } from 'react';
import { useCanvas } from './CanvasProvider.jsx';
import { Size } from './types.js';
import { Viewport } from './Viewport.js';
import {
	useKeyboardControls,
	useViewportGestureControls,
} from './viewportHooks.js';

export function useViewport() {
	const canvas = useCanvas();
	return canvas.viewport;
}

export const ViewportContext = createContext<Viewport | null>(null);

export interface ViewportProviderProps {
	children?: React.ReactNode;
	minZoom?: number;
	maxZoom?: number;
	defaultZoom?: number;
	canvasSize?: Size | null;
}

export const ViewportRoot = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const viewport = useViewport();
	const ref = useRef<HTMLDivElement>(null);

	const viewportProps = useViewportGestureControls(viewport, ref);

	const keyboardProps = useKeyboardControls(viewport);

	const finalRef = useMergedRefs(ref, keyboardProps.ref, viewport.bindElement);

	return (
		<div
			className={clsx(
				'w-full h-full flex-1 overflow-hidden select-none cursor-move relative touch-none contain-strict',
				className,
			)}
			{...viewportProps}
			{...keyboardProps}
			ref={finalRef}
		>
			{children}
		</div>
	);
};

function useMergedRefs<T>(...refs: React.Ref<T>[]) {
	return useCallback((value: T | null) => {
		refs.forEach((ref) => {
			if (!ref) return;
			if (typeof ref === 'function') {
				ref(value);
			} else {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
	}, refs);
}
