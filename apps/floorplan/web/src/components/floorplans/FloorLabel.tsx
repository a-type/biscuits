import { hooks } from '@/hooks.js';
import { useMotionPoint } from '@/hooks/useVerdantMotion.js';
import { clsx } from '@a-type/ui';
import { FloorLabelsValue } from '@floorplan.biscuits/verdant';
import { motion, useMotionTemplate } from 'motion/react';

export interface FloorLabelProps {
	label: FloorLabelsValue;
}

export function FloorLabel({ label }: FloorLabelProps) {
	const { content, center } = hooks.useWatch(label);
	const position = useMotionPoint(center);

	const transform = useMotionTemplate`translate(${position.x}px, ${position.y}px) scale(calc(2/var(--zoom-settled, 1)))`;

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
				className={clsx('fill-white', 'stroke-none text-[5px] font-mono')}
			>
				{content}
			</motion.text>
		</motion.g>
	);
}
