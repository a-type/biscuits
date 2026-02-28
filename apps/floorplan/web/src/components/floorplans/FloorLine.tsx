import { hooks } from '@/hooks.js';
import { useMotionPoint } from '@/hooks/useVerdantMotion.js';
import { clsx, useViewport } from '@a-type/ui';
import {
	FloorLinesValue,
	FloorLinesValueStart as SnapPoint,
} from '@floorplan.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import { motion, useTransform } from 'motion/react';
import { useRef, useSyncExternalStore } from 'react';
import { useSnapshot } from 'valtio';
import { editorState, gestureClaim, toggleSelection } from './editorState.js';
import { LinePointHandle } from './LinePointHandle.jsx';
import { LineRenderer } from './LineRenderer.jsx';

const DEBUG = false;

export interface FloorLineProps {
	line: FloorLinesValue;
}

export function FloorLine({ line }: FloorLineProps) {
	const { start, end, id } = hooks.useWatch(line);
	const { x: startX, y: startY } = useMotionPoint(start);
	const { x: endX, y: endY } = useMotionPoint(end);
	const selected = useSnapshot(editorState).selections.includes(id);

	const ref = useRef<SVGGElement>(null);

	useDrag(
		(state) => {
			gestureClaim(state);
			if (state.last) {
				if (state.tap) {
					if (editorState.tool === 'select' || editorState.tool === 'line') {
						toggleSelection(
							id,
							state.ctrlKey || state.metaKey || state.shiftKey,
						);
					}
				}
			}
		},
		{
			target: ref,
		},
	);

	return (
		<g
			className={clsx(
				'touch-none',
				selected ? 'z-100 stroke-primary' : 'stroke-black',
			)}
			data-line-id={id}
		>
			<g ref={ref} data-role="line-hitbox">
				{/* hittest */}
				<motion.line
					x1={startX}
					y1={startY}
					x2={endX}
					y2={endY}
					className="cursor-pointer touch-none stroke-width-[calc(10/var(--zoom-settled))] stroke-transparent"
				/>
				<LineRenderer
					startX={startX}
					startY={startY}
					endX={endX}
					endY={endY}
					ref={ref}
				/>
			</g>
			{selected && (
				<>
					<LinePointHandle point={start} oppositePoint={end} />
					<LinePointHandle point={end} oppositePoint={start} />
				</>
			)}
			<SnapIndicator point={start} />
			<SnapIndicator point={end} />
			{DEBUG && (
				<>
					<PointDebug point={start} side="start" />
					<PointDebug point={end} side="end" />
					<LineDebug line={line} />
				</>
			)}
		</g>
	);
}

function SnapIndicator({ point }: { point: SnapPoint }) {
	const { snap } = hooks.useWatch(point);
	const position = useMotionPoint(point);
	const viewport = useViewport();
	const zoom = useSyncExternalStore(
		(cb) => viewport.subscribe('zoomChanged', cb),
		() => viewport.zoom,
		() => viewport.zoom,
	);

	if (snap) {
		return (
			<motion.circle
				cx={position.x}
				cy={position.y}
				r={5 / zoom}
				className="pointer-events-none fill-none stroke-width-[calc(2/var(--zoom-settled))] stroke-gray"
			/>
		);
	}

	return null;
}

function PointDebug({
	point,
	side,
}: {
	point: SnapPoint;
	side: 'start' | 'end';
}) {
	const { snap } = hooks.useWatch(point);
	const position = useMotionPoint(point);

	return (
		<motion.text
			x={position.x}
			y={position.y}
			className="pointer-events-none fill-black text-xxs"
		>
			{side} |{' '}
			{snap ? `snapped to ${snap.get('lineId')}-${snap.get('side')}` : 'free'}
		</motion.text>
	);
}

function LineDebug({ line }: { line: FloorLinesValue }) {
	const { start, end, id } = hooks.useWatch(line);
	const startPos = useMotionPoint(start);
	const endPos = useMotionPoint(end);

	const midX = useTransform(
		[startPos.x, endPos.x],
		([sx, ex]): number => ((sx as number) + (ex as number)) / 2,
	);
	const midY = useTransform(
		[startPos.y, endPos.y],
		([sy, ey]): number => ((sy as number) + (ey as number)) / 2 - 10,
	);

	return (
		<motion.text
			x={midX}
			y={midY}
			className="pointer-events-none fill-black text-xxs"
		>
			{id}
		</motion.text>
	);
}
