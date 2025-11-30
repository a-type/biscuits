import { hooks } from '@/hooks.js';
import { Input } from '@a-type/ui';
import { Floor } from '@floorplan.biscuits/verdant';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';
import { getPointValue, updatePointOrSnap } from './pointLogic.js';

export interface LineLengthInputProps {
	floor: Floor;
}

export function LineLengthInput({ floor }: LineLengthInputProps) {
	const show = useSnapshot(editorState).editingLength;
	const { lines } = hooks.useWatch(floor);
	hooks.useWatch(lines, { deep: true });

	const selectedLines = lines.filter((line) =>
		editorState.selections.includes(line.get('id')),
	);

	const client = hooks.useClient();

	if (!show || !selectedLines.length) {
		return null;
	}

	const lineValuesSet = new Set<number>();
	selectedLines.forEach((line) => {
		const start = line.get('start');
		const end = line.get('end');
		const startX = getPointValue(floor, start, 'x');
		const startY = getPointValue(floor, start, 'y');
		const endX = getPointValue(floor, end, 'x');
		const endY = getPointValue(floor, end, 'y');
		const dx = endX - startX;
		const dy = endY - startY;
		const length = Math.sqrt(dx * dx + dy * dy);
		lineValuesSet.add(length);
	});

	const displayValue =
		lineValuesSet.size === 1 ? Array.from(lineValuesSet)[0].toFixed(2) : '#.##';

	return (
		<Input
			value={displayValue}
			onValueChange={(v) => {
				client.batch().run(() => {
					selectedLines.forEach((line) => {
						// update end point to match new length
						const start = line.get('start');
						const startX = getPointValue(floor, start, 'x');
						const startY = getPointValue(floor, start, 'y');
						const end = line.get('end');
						const endX = getPointValue(floor, end, 'x');
						const endY = getPointValue(floor, end, 'y');
						const dx = endX - startX;
						const dy = endY - startY;
						const currentLength = Math.sqrt(dx * dx + dy * dy);
						const newLength = parseFloat(v);
						if (isNaN(newLength) || newLength <= 0) {
							return;
						}
						const scale = newLength / currentLength;
						const newEndX = startX + dx * scale;
						const newEndY = startY + dy * scale;
						updatePointOrSnap(floor, end, { x: newEndX, y: newEndY });
					});
				});
			}}
			aria-label="Change line length"
		/>
	);
}
