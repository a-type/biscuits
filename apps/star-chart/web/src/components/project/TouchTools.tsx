import { clsx } from '@a-type/ui';
import { useBoxSelectEnabled, useDragLocked } from '../canvas/canvasHooks.js';
import { useCanvas } from '../canvas/CanvasProvider.jsx';
import { Button } from '@a-type/ui/components/button';
import { CanvasOverlayContent } from '../canvas/CanvasOverlay.jsx';
import { useIsTouch } from '@biscuits/client';

export interface TouchToolsProps {
  className?: string;
}

export function TouchTools({ className }: TouchToolsProps) {
  const canvas = useCanvas();

  const dragLocked = useDragLocked();
  const boxSelect = useBoxSelectEnabled();

  const isTouchscreen = useIsTouch();

  return (
    <CanvasOverlayContent
      className={clsx(
        'absolute left-2 bottom-2 bg-white p-2 rounded-lg shadow-md row',
        className,
      )}
    >
      <Button
        size="small"
        color="ghost"
        onClick={() => (canvas.tools.dragLocked = !dragLocked)}
        aria-pressed={dragLocked}
        className={clsx(
          'flex-col gap-0 rounded-md px-1 py-0',
          dragLocked && 'bg-primary-light text-primary-dark',
        )}
      >
        <span>{dragLocked ? '🔒' : '🔓'}</span>
        <span className="text-[8px] leading-tight">Drag Lock</span>
      </Button>
      {isTouchscreen && (
        <Button
          size="small"
          color="ghost"
          onClick={() => (canvas.tools.boxSelect = !boxSelect)}
          aria-pressed={boxSelect}
          className={clsx(
            'flex-col gap-0 rounded-md px-1 py-0',
            boxSelect && 'bg-primary-light text-primary-dark',
          )}
        >
          <span>🔲</span>
          <span className="text-[8px] leading-tight">Box Select</span>
        </Button>
      )}
    </CanvasOverlayContent>
  );
}
