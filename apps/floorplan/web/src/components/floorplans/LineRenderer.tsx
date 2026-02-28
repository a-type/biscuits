import { clsx } from '@a-type/ui';
import { motion, MotionValue } from 'motion/react';

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
		</g>
	);
}
