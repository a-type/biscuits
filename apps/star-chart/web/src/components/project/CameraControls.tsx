import { useSyncExternalStore } from 'react';
import { useViewport } from '../canvas/ViewportRoot.jsx';
import { Slider } from '@a-type/ui/components/slider';
import { disableDragProps } from '../canvas/CanvasObjectDragHandle.jsx';
import { CanvasOverlayContent } from '../canvas/CanvasOverlay.jsx';

export interface CameraControlsProps {}

export function CameraControls({}: CameraControlsProps) {
	const viewport = useViewport();
	const zoom = useSyncExternalStore(
		(cb) => viewport.subscribe('zoomChanged', cb),
		() => viewport.zoom,
	);

	return (
		<CanvasOverlayContent
			className="absolute bottom-1 right-1 row pointer-events-none"
			{...disableDragProps}
		>
			<Slider
				value={[zoom]}
				onValueChange={([v]) => {
					viewport.doZoom(v, { gestureComplete: true });
				}}
				min={viewport.config.zoomLimits.min}
				max={viewport.config.zoomLimits.max}
				step={0.01}
				color="default"
				className="pointer-events-auto w-100px max-w-80dvw cursor-pointer"
			/>
		</CanvasOverlayContent>
	);
}
