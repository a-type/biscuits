import { Button, clsx, Icon } from '@a-type/ui';
import { useIsTouch } from '@biscuits/client';
import { useEffect } from 'react';
import { useBoxSelectEnabled, useDragLocked } from '../canvas/canvasHooks.js';
import { CanvasOverlayContent } from '../canvas/CanvasOverlay.jsx';
import { useCanvas } from '../canvas/CanvasProvider.jsx';

export interface TouchToolsProps {
	className?: string;
}

export function TouchTools({ className }: TouchToolsProps) {
	const canvas = useCanvas();

	const dragLocked = useDragLocked();
	const boxSelect = useBoxSelectEnabled();

	const isTouchscreen = useIsTouch();
	// auto-lock on touch devices.
	useEffect(() => {
		if (isTouchscreen) {
			canvas.tools.dragLocked = true;
		}
	}, [canvas, isTouchscreen]);

	return (
		<CanvasOverlayContent
			className={clsx(
				'absolute left-2 bottom-2 bg-white p-2 rounded-lg shadow-md row',
				className,
			)}
		>
			<Button
				size="small"
				emphasis="ghost"
				onClick={() => (canvas.tools.dragLocked = !dragLocked)}
				aria-pressed={dragLocked}
				className={clsx(
					'flex-col gap-0 rounded-md px-1 py-0',
					dragLocked && 'bg-primary-wash color-primary-dark',
				)}
			>
				<span>
					<Icon name={dragLocked ? 'lock' : 'lockOpen'} />
				</span>
				<span className="text-[8px] leading-tight">Drag Lock</span>
			</Button>
			{isTouchscreen && (
				<Button
					size="small"
					emphasis="ghost"
					onClick={() => (canvas.tools.boxSelect = !boxSelect)}
					aria-pressed={boxSelect}
					className={clsx(
						'flex-col gap-0 rounded-md px-1 py-0',
						boxSelect && 'bg-primary-wash color-primary-dark',
					)}
				>
					<span>
						<Icon name="maximize" />
					</span>
					<span className="text-[8px] leading-tight">Box Select</span>
				</Button>
			)}
		</CanvasOverlayContent>
	);
}
