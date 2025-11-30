import { clsx } from '@a-type/ui';
import {
	motion,
	MotionValue,
	useMotionTemplate,
	useTransform,
} from 'motion/react';
import { MouseEvent, PointerEvent } from 'react';

export interface LineRendererProps {
	startX: MotionValue<number>;
	startY: MotionValue<number>;
	endX: MotionValue<number>;
	endY: MotionValue<number>;
	lineDash?: string;
	onClick?: (ev: PointerEvent | MouseEvent, target: 'line' | 'label') => void;
	editingLength?: boolean;
}

export function LineRenderer({
	startX,
	startY,
	endX,
	endY,
	lineDash,
	onClick,
	editingLength,
	...rest
}: LineRendererProps) {
	return (
		<>
			<motion.line
				x1={startX}
				y1={startY}
				x2={endX}
				y2={endY}
				strokeWidth="2"
				strokeDasharray={lineDash}
				onClick={(ev) => onClick?.(ev, 'line')}
				className="stroke-inherit"
				{...rest}
			/>
			<LineLengthLabel
				startX={startX}
				startY={startY}
				endX={endX}
				endY={endY}
				onClick={(ev) => onClick?.(ev, 'label')}
				editing={editingLength}
			/>
		</>
	);
}

export function LineLengthLabel({
	startX,
	startY,
	endX,
	endY,
	onClick,
	editing,
}: {
	startX: MotionValue<number>;
	startY: MotionValue<number>;
	endX: MotionValue<number>;
	endY: MotionValue<number>;
	onClick?: (ev: PointerEvent | MouseEvent) => void;
	editing?: boolean;
}) {
	const centerX = useTransform(
		() => (endX.get() - startX.get()) / 2 + startX.get(),
	);
	const centerY = useTransform(
		() => (endY.get() - startY.get()) / 2 + startY.get(),
	);
	const length = useTransform(() =>
		Math.hypot(endX.get() - startX.get(), endY.get() - startY.get()).toFixed(2),
	);
	const transform = useMotionTemplate`translate(${centerX}px, ${centerY}px)`;
	const label = useMotionTemplate`${length}m`;

	return (
		<motion.g style={{ transform }} onClick={onClick}>
			<rect
				width={30}
				height={10}
				x={-15}
				y={-5}
				rx={2}
				ry={2}
				className={editing ? 'fill-white' : 'fill-black'}
			/>
			<motion.text
				x={0}
				y={0}
				dominantBaseline="middle"
				textAnchor="middle"
				className={clsx(
					editing ? 'fill-black' : 'fill-white',
					'stroke-none font-mono text-[5px]',
				)}
			>
				{label}
			</motion.text>
		</motion.g>
	);
}
