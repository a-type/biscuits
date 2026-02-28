import { clsx } from '@a-type/ui';
import { FloorShapesValueType } from '@floorplan.biscuits/verdant';
import {
	motion,
	MotionValue,
	useMotionTemplate,
	useTransform,
} from 'motion/react';

export function ShapeRenderer({
	centerX,
	centerY,
	width,
	height,
	angle,
	type,
}: {
	centerX: MotionValue<number>;
	centerY: MotionValue<number>;
	width: MotionValue<number>;
	height: MotionValue<number>;
	type: FloorShapesValueType;
	angle: MotionValue<number>;
}) {
	const ellipseRx = useTransform(width, (w) => w / 2);
	const ellipseRy = useTransform(height, (h) => h / 2);

	const rectX = useTransform(centerX, (x) => x - width.get() / 2);
	const rectY = useTransform(centerY, (y) => y - height.get() / 2);

	const transform = useMotionTemplate`rotate(${angle}rad)`;

	if (type === 'rectangle') {
		return (
			<motion.rect
				x={rectX}
				y={rectY}
				width={width}
				height={height}
				transform={transform}
				className={clsx(
					'stroke-inherit fill-white stroke-width-[calc(2/var(--zoom-settled))]',
				)}
			/>
		);
	} else if (type === 'ellipse') {
		return (
			<motion.ellipse
				cx={centerX}
				cy={centerY}
				rx={ellipseRx}
				ry={ellipseRy}
				transform={transform}
				className="stroke-inherit fill-white stroke-width-[calc(2/var(--zoom-settled))]"
			/>
		);
	} else {
		return null;
	}
}
