import { clsx } from '@a-type/ui';
import {
	motion,
	MotionValue,
	useMotionTemplate,
	useTransform,
} from 'motion/react';

export interface LineRendererProps extends React.SVGProps<SVGGElement> {
	startX: MotionValue<number>;
	startY: MotionValue<number>;
	endX: MotionValue<number>;
	endY: MotionValue<number>;
	lineDash?: string;
	editingLength?: boolean;
}

export function LineRenderer({
	startX,
	startY,
	endX,
	endY,
	lineDash,
	editingLength,
	className,
	...rest
}: LineRendererProps) {
	return (
		<g className="touch-none" {...rest}>
			<motion.line
				x1={startX}
				y1={startY}
				x2={endX}
				y2={endY}
				strokeDasharray={lineDash}
				className={clsx(
					'stroke-inherit pointer-events-none stroke-width-[calc(2/var(--zoom-settled))]',
					className,
				)}
			/>
			<LineLengthLabel
				startX={startX}
				startY={startY}
				endX={endX}
				endY={endY}
				editing={editingLength}
			/>
		</g>
	);
}

export function LineLengthLabel({
	startX,
	startY,
	endX,
	endY,
	editing,
}: {
	startX: MotionValue<number>;
	startY: MotionValue<number>;
	endX: MotionValue<number>;
	endY: MotionValue<number>;
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
	const transform = useMotionTemplate`translate(${centerX}px, ${centerY}px) scale(calc(2/var(--zoom-settled, 1)))`;
	const label = useMotionTemplate`${length}m`;

	return (
		<motion.g style={{ transform }}>
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
