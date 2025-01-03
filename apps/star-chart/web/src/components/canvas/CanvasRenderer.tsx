import { animated, to, useSpring } from '@react-spring/web';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useCanvas } from './CanvasProvider.jsx';
import { SPRINGS } from './constants.js';
import { PresenceCursors } from './PresenceCursors.jsx';
import { rerasterizeSignal } from './rerasterizeSignal.js';
import { Vector2 } from './types.js';
import { ViewportEventOrigin } from './Viewport.js';
import { useViewport } from './ViewportRoot.jsx';

const VIEWPORT_ORIGIN_SPRINGS = {
	control: SPRINGS.QUICK,
	animation: SPRINGS.RELAXED,
	// not actually used, for direct we do immediate:true to disable
	// easing
	direct: SPRINGS.RESPONSIVE,
};

export interface IViewportRendererProps {
	children?: ReactNode;
	onZoomChange?: (zoom: number) => void;
	onTap?: (position: Vector2) => void;
}

export const CanvasRenderer = ({
	children,
	onZoomChange,
	onTap,
}: IViewportRendererProps) => {
	const viewport = useViewport();
	const ref = useRef<HTMLDivElement>(null);

	// keep track of viewport element size as provided by Viewport class
	const [viewportSize, setViewportSize] = useState(viewport.elementSize);
	useEffect(() => {
		return viewport.subscribe('sizeChanged', setViewportSize);
	}, [viewport]);

	// the main spring which controls the Canvas transformation.
	// X/Y position is in World Space - i.e. the coordinate space
	// is not affected by the zoom
	const [{ centerX, centerY }, panSpring] = useSpring(() => ({
		centerX: viewport.center.x,
		centerY: viewport.center.y,
		config: SPRINGS.RELAXED,
	}));
	const [{ zoom }, zoomSpring] = useSpring(() => ({
		zoom: viewport.zoom,
		isZooming: false,
		config: SPRINGS.RELAXED,
	}));

	useEffect(() => {
		async function handleCenterChanged(
			center: Readonly<Vector2>,
			origin: ViewportEventOrigin,
		) {
			panSpring.start({
				centerX: center.x,
				centerY: center.y,
				immediate: origin === 'direct',
				config: VIEWPORT_ORIGIN_SPRINGS[origin],
			});
		}
		async function handleZoomChanged(
			zoomValue: number,
			origin: ViewportEventOrigin,
		) {
			onZoomChange?.(zoomValue);
			await zoomSpring.start({
				zoom: zoomValue,
				immediate: origin === 'direct',
				config: VIEWPORT_ORIGIN_SPRINGS[origin],
			})[0];
		}
		const unsubs = [
			viewport.subscribe('centerChanged', handleCenterChanged),
			viewport.subscribe('zoomChanged', handleZoomChanged),
			viewport.subscribe('zoomSettled', (zoom) => {
				// wait until after animation settles to update variable
				// and trigger rerasterize
				ref.current?.style.setProperty('--zoom-settled', zoom.toString());
				rerasterizeSignal.dispatchEvent(new Event('rerasterize'));
			}),
		];
		return () => {
			unsubs.forEach((unsub) => unsub());
		};
	}, [viewport, panSpring, zoomSpring, onZoomChange]);

	const canvas = useCanvas();

	return (
		<animated.div
			ref={ref}
			className="absolute origin-center overflow-visible overscroll-none touch-none"
			style={{
				transform: to([centerX, centerY, zoom], (cx, cy, zoomv) => {
					// 1. Translate the center of the canvas to 0,0 (-halfCanvasWidth, -halfCanvasHeight)
					// 2. Translate that center point back to the center of the screen (+viewport.size.width / 2, +viewport.size.height / 2)
					// 3. Scale up (or down) to the specified zoom value
					// 4. Translate the center according to the pan position
					return `translate(${viewportSize.width / 2}px, ${
						viewportSize.height / 2
					}px) scale(${zoomv}, ${zoomv}) translate(${-cx}px, ${-cy}px)`;
				}),
				// @ts-ignore
				'--zoom': zoom,
				// @ts-ignore
				'--grid-size': `${canvas.snapIncrement > 1 ? canvas.snapIncrement : 24}px`,
			}}
		>
			{children}
			<PresenceCursors />
		</animated.div>
	);
};
