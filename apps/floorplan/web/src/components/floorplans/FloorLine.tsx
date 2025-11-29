import { hooks } from '@/hooks.js';
import { useVerdantMotion } from '@/hooks/useVerdantMotion.js';
import { FloorLinesItem } from '@floorplan.biscuits/verdant';
import { useSnapshot } from 'valtio';
import { editorState } from './editorState.js';
import { LineRenderer } from './LineRenderer.jsx';

export interface FloorLineProps {
	line: FloorLinesItem;
}

export function FloorLine({ line }: FloorLineProps) {
	const { start, end, id } = hooks.useWatch(line);
	const startX = useVerdantMotion(start, 'x');
	const startY = useVerdantMotion(start, 'y');
	const endX = useVerdantMotion(end, 'x');
	const endY = useVerdantMotion(end, 'y');
	const selected = useSnapshot(editorState).selections.includes(id);

	return (
		<LineRenderer
			startX={startX}
			startY={startY}
			endX={endX}
			endY={endY}
			selected={selected}
			onClick={(ev) => {
				if (editorState.selections.includes(id)) {
					editorState.selections = editorState.selections.filter(
						(s) => s !== id,
					);
				} else {
					if (ev.ctrlKey || ev.metaKey) {
						editorState.selections.push(id);
					} else {
						editorState.selections = [id];
					}
				}
			}}
		/>
	);
}
