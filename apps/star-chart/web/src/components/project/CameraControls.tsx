import { useSyncExternalStore } from 'react';
import { useViewport } from '../canvas/ViewportProvider.jsx';
import { Slider } from '@a-type/ui/components/slider';

export interface CameraControlsProps {}

export function CameraControls({}: CameraControlsProps) {
  const viewport = useViewport();
  const zoom = useSyncExternalStore(
    (cb) => viewport.subscribe('zoomChanged', cb),
    () => viewport.zoom,
  );

  return (
    <div className="absolute bottom-1 right-1 row pointer-events-none">
      <Slider
        value={[zoom]}
        onValueChange={([v]) => {
          viewport.doZoom(v);
        }}
        min={viewport.config.zoomLimits.min}
        max={viewport.config.zoomLimits.max}
        step={0.01}
        color="default"
        className="pointer-events-auto w-100px max-w-80vw cursor-pointer"
      />
    </div>
  );
}
