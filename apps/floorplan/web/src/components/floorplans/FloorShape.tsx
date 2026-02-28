import { hooks } from '@/hooks.js';
import { useMotionNumber, useMotionPoint } from '@/hooks/useVerdantMotion.js';
import { clsx, useViewport } from '@a-type/ui';
import { FloorShapesValue } from '@floorplan.biscuits/verdant';
import { useDrag } from '@use-gesture/react';
import { motion, useMotionTemplate, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useSnapshot } from 'valtio';
import { editorState, toggleSelection } from './editorState.js';
import { useFloor } from './FloorProvider.jsx';
import { applyPointSnap } from './pointLogic.js';
import { computeConstrainedInput } from './positioning.js';
import { ShapeRenderer } from './ShapeRenderer.jsx';

export interface FloorShapeProps {
	shape: FloorShapesValue;
}

export function FloorShape({ shape }: FloorShapeProps) {
	const { center, type, id } = hooks.useWatch(shape);
	const { x: centerX, y: centerY } = useMotionPoint(center);
	const selected = useSnapshot(editorState).selections.includes(id);

	const ref = useRef<SVGGElement>(null);

	const viewport = useViewport();
	const floor = useFloor();

	const liveWidth = useMotionNumber(shape, 'width');
	const liveHeight = useMotionNumber(shape, 'height');
	const liveAngle = useMotionNumber(shape, 'angle');

	useDrag(
		(state) => {
			if (state.last && state.tap && editorState.tool === 'select') {
				toggleSelection(id, state.ctrlKey || state.metaKey || state.shiftKey);
			}

			if (!state.tap) {
				const result = computeConstrainedInput({
					input: viewport.viewportToWorld({
						x: state.xy[0],
						y: state.xy[1],
					}),
					first: false,
					startX: centerX,
					startY: centerY,
					floor,
				});
				applyPointSnap(floor, center, result);
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
			data-shape-id={id}
		>
			<g className="touch-none" data-role="move-handle" ref={ref}>
				<ShapeRenderer
					centerX={centerX}
					centerY={centerY}
					width={liveWidth}
					height={liveHeight}
					type={type}
					angle={liveAngle}
				/>
			</g>
			{selected && (
				<>
					<FloorShapeResizeHandle shape={shape} property="width" />
					<FloorShapeResizeHandle shape={shape} property="height" />
					<FloorShapeRotationHandle shape={shape} />
				</>
			)}
		</g>
	);
}

function FloorShapeResizeHandle({
	shape,
	property,
}: {
	shape: FloorShapesValue;
	property: 'width' | 'height';
}) {
	const { center, id } = hooks.useWatch(shape);
	const { x: centerX, y: centerY } = useMotionPoint(center);
	const value = useMotionNumber(shape, property);
	const angle = useMotionNumber(shape, 'angle');

	const ref = useRef<SVGGElement>(null);

	const viewport = useViewport();

	const x = useTransform(value, (v) => (property === 'width' ? v / 2 : 0));
	const y = useTransform(value, (v) => (property === 'height' ? v / 2 : 0));
	const transform = useMotionTemplate`translate(${centerX}px, ${centerY}px) rotate(${angle}rad) translate(calc(${x}px), calc(${y}px))`;

	useDrag(
		(state) => {
			const x = state.xy[0];
			const y = state.xy[1];
			const result = viewport.viewportToWorld({ x, y });
			if (property === 'width') {
				shape.set('width', Math.abs(result.x - center.get('x')) * 2);
			} else {
				shape.set('height', Math.abs(result.y - center.get('y')) * 2);
			}
		},
		{
			target: ref,
		},
	);

	return (
		<g className="cursor-pointer touch-none" data-shape-id={id} ref={ref}>
			<motion.rect
				x={0}
				y={0}
				transform={transform}
				width={1}
				height={1}
				className="fill-black stroke-width-[calc(2/var(--zoom-settled))] stroke-primary"
			/>
		</g>
	);
}

const ROTATE_HANDLE_DISTANCE = 2;
function FloorShapeRotationHandle({ shape }: { shape: FloorShapesValue }) {
	const { center, id } = hooks.useWatch(shape);
	const { x: centerX, y: centerY } = useMotionPoint(center);
	const width = useMotionNumber(shape, 'width');
	const height = useMotionNumber(shape, 'height');
	const angle = useMotionNumber(shape, 'angle');

	const ref = useRef<SVGGElement>(null);

	const transform = useMotionTemplate`rotate(${angle}rad) translate(calc(${width}px / 2 + ${ROTATE_HANDLE_DISTANCE}px), calc(${height}px / 2 + ${ROTATE_HANDLE_DISTANCE}px)	)`;

	const viewport = useViewport();

	useDrag(
		(state) => {
			const x = state.xy[0];
			const y = state.xy[1];
			const result = viewport.viewportToWorld({ x, y });
			const angle = Math.atan2(
				result.y - center.get('y'),
				result.x - center.get('x'),
			);
			shape.set('angle', angle);
		},
		{
			target: ref,
		},
	);

	return (
		<g className="cursor-pointer touch-none" data-shape-id={id} ref={ref}>
			<motion.circle
				cx={centerX}
				cy={centerY}
				transform={transform}
				r={0.5}
				className="fill-black stroke-width-[calc(2/var(--zoom-settled))] stroke-primary"
			/>
		</g>
	);
}
