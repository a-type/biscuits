import { hooks } from '@/hooks.js';
import { useMotionPoint } from '@/hooks/useVerdantMotion.js';
import { clsx } from '@a-type/ui';
import {
	Floor,
	FloorLinesItem,
	FloorLinesItemStart,
} from '@floorplan.biscuits/verdant';
import { motion, useTransform } from 'motion/react';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';
import { LinePointHandle } from './LinePointHandle.jsx';
import { LineRenderer } from './LineRenderer.jsx';

const DEBUG = false;

export interface FloorLineProps {
	line: FloorLinesItem;
	floor: Floor;
}

export function FloorLine({ line, floor }: FloorLineProps) {
	const { start, end, id } = hooks.useWatch(line);
	const { x: startX, y: startY } = useMotionPoint(floor, start);
	const { x: endX, y: endY } = useMotionPoint(floor, end);
	const selected = useSnapshot(editorState).selections.includes(id);

	return (
		<g
			className={clsx(selected ? 'stroke-primary z-100' : 'stroke-black')}
			data-line-id={id}
		>
			<LineRenderer
				startX={startX}
				startY={startY}
				endX={endX}
				endY={endY}
				onClick={(ev, target) => {
					if (editorState.selections.includes(id)) {
						if (target === 'label') {
						} else {
							editorState.selections = editorState.selections.filter(
								(s) => s !== id,
							);
						}
					} else {
						if (ev.ctrlKey || ev.metaKey) {
							editorState.selections.push(id);
						} else {
							editorState.selections = [id];
						}
					}
				}}
			/>
			{selected && (
				<>
					<LinePointHandle point={start} oppositePoint={end} floor={floor} />
					<LinePointHandle point={end} oppositePoint={start} floor={floor} />
				</>
			)}
			<SnapIndicator point={start} floor={floor} />
			<SnapIndicator point={end} floor={floor} />
			{DEBUG && (
				<>
					<PointDebug point={start} floor={floor} side="start" />
					<PointDebug point={end} floor={floor} side="end" />
					<LineDebug line={line} floor={floor} />
				</>
			)}
		</g>
	);
}

function SnapIndicator({
	point,
	floor,
}: {
	point: FloorLinesItemStart;
	floor: Floor;
}) {
	const { snap } = hooks.useWatch(point);
	const position = useMotionPoint(floor, point);

	if (snap) {
		return (
			<motion.circle
				cx={position.x}
				cy={position.y}
				r={5}
				className="stroke-gray fill-none"
			/>
		);
	}

	return null;
}

function PointDebug({
	point,
	floor,
	side,
}: {
	point: FloorLinesItemStart;
	floor: Floor;
	side: 'start' | 'end';
}) {
	const { snap } = hooks.useWatch(point);
	const position = useMotionPoint(floor, point);

	return (
		<motion.text
			x={position.x}
			y={position.y}
			className="text-xxs fill-black pointer-events-none"
		>
			{side} |{' '}
			{snap ? `snapped to ${snap.get('lineId')}-${snap.get('side')}` : 'free'}
		</motion.text>
	);
}

function LineDebug({ line, floor }: { line: FloorLinesItem; floor: Floor }) {
	const { start, end, id } = hooks.useWatch(line);
	const startPos = useMotionPoint(floor, start);
	const endPos = useMotionPoint(floor, end);

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
			className="text-xxs fill-black pointer-events-none"
		>
			{id}
		</motion.text>
	);
}
