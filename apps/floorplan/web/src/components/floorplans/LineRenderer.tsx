import {
	motion,
	MotionValue,
	useMotionTemplate,
	useTransform,
} from 'motion/react';

export interface LineRendererProps {
	startX: MotionValue<number>;
	startY: MotionValue<number>;
	endX: MotionValue<number>;
	endY: MotionValue<number>;
	lineDash?: string;
}

export function LineRenderer({
	startX,
	startY,
	endX,
	endY,
	lineDash,
}: LineRendererProps) {
	return (
		<>
			<motion.line
				x1={startX}
				y1={startY}
				x2={endX}
				y2={endY}
				stroke="black"
				strokeWidth="2"
				strokeDasharray={lineDash}
			/>
			<LineLengthLabel
				startX={startX}
				startY={startY}
				endX={endX}
				endY={endY}
			/>
		</>
	);
}

export function LineLengthLabel({
	startX,
	startY,
	endX,
	endY,
}: {
	startX: MotionValue<number>;
	startY: MotionValue<number>;
	endX: MotionValue<number>;
	endY: MotionValue<number>;
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
		<motion.g style={{ transform }}>
			<rect
				width={30}
				height={10}
				x={-15}
				y={-5}
				rx={2}
				ry={2}
				className="fill-black"
			/>
			<motion.text
				x={0}
				y={0}
				dominantBaseline="middle"
				textAnchor="middle"
				className="fill-white font-mono text-[5px]"
			>
				{label}
			</motion.text>
		</motion.g>
	);
}
