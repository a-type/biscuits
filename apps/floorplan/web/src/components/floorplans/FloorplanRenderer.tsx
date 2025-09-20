import { hooks } from '@/hooks.js';
import { Box, clsx, useViewport, Viewport } from '@a-type/ui';
import { Floor } from '@floorplan.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import { useMotionValue } from 'motion/react';
import { Suspense, useState } from 'react';
import { FloorLine } from './FloorLine.jsx';
import { Grid } from './Grid.jsx';
import { LineRenderer } from './LineRenderer.jsx';

export interface FloorplanRendererProps {
	className?: string;
	id: string;
}

export function FloorplanRenderer({ className, id }: FloorplanRendererProps) {
	const [activeTool, setActiveTool] = useState('line');
	return (
		<Viewport
			className={clsx('bg-gray', className)}
			gestureOptions={{
				filterDrag: (state) => {
					const isFirstButton = (state.buttons & 1) === 1;
					const isTouch = state.touches > 0;
					return (isFirstButton || isTouch) && !!activeTool;
				},
			}}
		>
			<Suspense>
				<FloorplanContent id={id} />
			</Suspense>
			<Viewport.Control>
				<Viewport.ZoomControls />
			</Viewport.Control>
		</Viewport>
	);
}

function FloorplanContent({ id }: { id: string }) {
	const floor = hooks.useFloor(id);

	const viewport = useViewport();

	const [toolActive, setToolActive] = useState(false);
	const toolStartX = useMotionValue(0);
	const toolStartY = useMotionValue(0);
	const toolEndX = useMotionValue(0);
	const toolEndY = useMotionValue(0);
	const bind = useDrag((state) => {
		const pos = viewport.viewportToWorld({
			x: state.xy[0],
			y: state.xy[1],
		});

		if (state.first) {
			setToolActive(true);
			toolStartX.set(pos.x);
			toolStartY.set(pos.y);
		}

		if (state.last) {
			setToolActive(false);
			floor?.get('lines').push({
				start: viewport.viewportToWorld({
					x: state.initial[0],
					y: state.initial[1],
				}),
				end: pos,
			});
		}

		toolEndX.set(pos.x);
		toolEndY.set(pos.y);
	});

	if (!floor) {
		return <Box>Missing floor</Box>;
	}

	return (
		<svg width={1000} height={1000} className="bg-white relative" {...bind()}>
			<g transform="translate(500, 500)">
				<Grid />
				<FloorplanLines floor={floor} />

				{toolActive && (
					<LineRenderer
						startX={toolStartX}
						startY={toolStartY}
						endX={toolEndX}
						endY={toolEndY}
					/>
				)}
			</g>
		</svg>
	);
}

function FloorplanLines({ floor }: { floor: Floor }) {
	const { lines } = hooks.useWatch(floor);
	hooks.useWatch(lines);

	return (
		<>
			{lines.map((line) => (
				<FloorLine key={line.get('id')} line={line} />
			))}
		</>
	);
}
