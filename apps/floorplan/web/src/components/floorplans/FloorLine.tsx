import { hooks } from '@/hooks.js';
import { useMotionPoint } from '@/hooks/useVerdantMotion.js';
import { clsx, useViewport } from '@a-type/ui';
import {
	Floor,
	FloorLinesItem,
	FloorLinesItemAttachmentsItem,
	FloorLinesItemStart,
} from '@floorplan.biscuits/verdant';
import { FullGestureState, useDrag } from '@use-gesture/react';
import { motion, MotionValue, useTransform } from 'motion/react';
import { useRef, useSyncExternalStore } from 'react';
import { useSnapshot } from 'valtio';
import { editorState, toggleSelection } from './editorState.js';
import { LinePointHandle } from './LinePointHandle.jsx';
import { LineRenderer } from './LineRenderer.jsx';
import { getPoint } from './pointLogic.js';

const DEBUG = false;

export interface FloorLineProps {
	line: FloorLinesItem;
	floor: Floor;
}

export function FloorLine({ line, floor }: FloorLineProps) {
	const { start, end, id, attachments } = hooks.useWatch(line);
	const { x: startX, y: startY } = useMotionPoint(start);
	const { x: endX, y: endY } = useMotionPoint(end);
	const selected = useSnapshot(editorState).selections.includes(id);
	const viewport = useViewport();

	hooks.useWatch(attachments);

	const ref = useRef<SVGGElement>(null);

	useDrag(
		(state) => {
			if (state.last) {
				if (state.tap) {
					if (editorState.tool === 'select' || editorState.tool === 'line') {
						toggleSelection(
							id,
							state.ctrlKey || state.metaKey || state.shiftKey,
						);
					} else if (editorState.tool === 'attachments') {
						// add attachment at tap position with default size
						const position = getGesturePositionOnLine(state);
						line.get('attachments').push({
							start: position,
							end: position + 1,
							direction: 'normal',
							type: editorState.activeAttachment,
						});
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
			className={clsx(selected ? 'z-100 stroke-primary' : 'stroke-black')}
			data-line-id={id}
			data-attachment-count={attachments.length}
			ref={ref}
		>
			{/* hittest */}
			<motion.line
				x1={startX}
				y1={startY}
				x2={endX}
				y2={endY}
				className="cursor-pointer touch-none stroke-width-[calc(10/var(--zoom-settled))] stroke-transparent"
			/>
			{attachments.length === 0 ?
				<LineRenderer
					startX={startX}
					startY={startY}
					endX={endX}
					endY={endY}
					ref={ref}
				/>
			:	<g data-purpose="attachments-and-segments">
					{attachments.map((attachment, index) => (
						<FloorLineAttachment
							key={attachment.get('id')}
							trueStartX={startX}
							trueStartY={startY}
							trueEndX={endX}
							trueEndY={endY}
							value={attachment}
							next={attachments.get(index + 1) ?? null}
						/>
					))}
				</g>
			}
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

	function getGesturePositionOnLine(state: FullGestureState<'drag'>) {
		const raw = viewport.viewportToWorld({
			x: state.xy[0],
			y: state.xy[1],
		});

		// find closest point on line to the raw input point
		const start = getPoint(floor, line.get('start'));
		const end = getPoint(floor, line.get('end'));

		const dx = end.x - start.x;
		const dy = end.y - start.y;
		const lengthSquared = dx * dx + dy * dy;
		if (lengthSquared === 0) {
			return start.x; // line is a point
		}
		const t = ((raw.x - start.x) * dx + (raw.y - start.y) * dy) / lengthSquared;
		const clampedT = Math.max(0, Math.min(1, t));
		const closestX = start.x + clampedT * dx;
		// return position along the line in terms of distance from start point
		return Math.hypot(closestX - start.x, start.y + clampedT * dy - start.y);
	}
}

function SnapIndicator({ point }: { point: FloorLinesItemStart }) {
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
	point: FloorLinesItemStart;
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

function LineDebug({ line }: { line: FloorLinesItem }) {
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

function FloorLineAttachment({
	trueStartX,
	trueStartY,
	trueEndX,
	trueEndY,
	value,
	next = null,
	prev = null,
}: {
	trueStartX: MotionValue<number>;
	trueStartY: MotionValue<number>;
	trueEndX: MotionValue<number>;
	trueEndY: MotionValue<number>;
	value: FloorLinesItemAttachmentsItem;
	next?: FloorLinesItemAttachmentsItem | null;
	prev?: FloorLinesItemAttachmentsItem | null;
}) {
	const { start, end, id } = hooks.useWatch(value);
	hooks.useWatch(next);
	const nextStart = next?.get('start') ?? 1;
	hooks.useWatch(prev);

	const normalized = useTransform(() => {
		const dx = trueEndX.get() - trueStartX.get();
		const dy = trueEndY.get() - trueStartY.get();
		const len = Math.hypot(dx, dy);
		if (len === 0) {
			return { x: 0, y: 0 };
		}
		return { x: dx / len, y: dy / len };
	});

	const segmentStartX = useTransform(() => {
		const fromX = trueStartX.get();
		return start * normalized.get().x + fromX;
	});
	const segmentStartY = useTransform(() => {
		const fromY = trueStartY.get();
		return start * normalized.get().y + fromY;
	});
	const segmentEndX = useTransform(() => {
		const fromX = trueStartX.get();
		return end * normalized.get().x + fromX;
	});
	const segmentEndY = useTransform(() => {
		const fromY = trueStartY.get();
		return end * normalized.get().y + fromY;
	});

	const nextStartX = useTransform(() => {
		const fromX = trueStartX.get();
		return nextStart * normalized.get().x + fromX;
	});
	const nextStartY = useTransform(() => {
		const fromY = trueStartY.get();
		return nextStart * normalized.get().y + fromY;
	});

	return (
		<>
			{!prev && (
				<LineRenderer
					startX={trueStartX}
					startY={trueStartY}
					endX={segmentStartX}
					endY={segmentStartY}
				/>
			)}
			<LineRenderer
				startX={segmentStartX}
				startY={segmentStartY}
				endX={segmentEndX}
				endY={segmentEndY}
				className={'stroke-8'}
				data-attachment-id={id}
				data-attachment-start={start}
				data-attachment-end={end}
			/>
			{next ?
				<LineRenderer
					startX={segmentEndX}
					startY={segmentEndY}
					endX={nextStartX}
					endY={nextStartY}
				/>
			:	<LineRenderer
					startX={segmentEndX}
					startY={segmentEndY}
					endX={trueEndX}
					endY={trueEndY}
				/>
			}
		</>
	);
}
