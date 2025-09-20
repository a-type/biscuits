import { hooks } from '@/hooks.js';
import { useVerdantMotion } from '@/hooks/useVerdantMotion.js';
import { FloorLinesItem } from '@floorplan.biscuits/verdant';
import { LineRenderer } from './LineRenderer.jsx';

export interface FloorLineProps {
	line: FloorLinesItem;
}

export function FloorLine({ line }: FloorLineProps) {
	const { start, end } = hooks.useWatch(line);
	const startX = useVerdantMotion(start, 'x');
	const startY = useVerdantMotion(start, 'y');
	const endX = useVerdantMotion(end, 'x');
	const endY = useVerdantMotion(end, 'y');
	return (
		<LineRenderer startX={startX} startY={startY} endX={endX} endY={endY} />
	);
}
