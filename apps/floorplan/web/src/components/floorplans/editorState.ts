import { FloorShapesValueType } from '@floorplan.biscuits/verdant';
import { proxy } from 'valtio';

export const editorState = proxy({
	tool: 'select' as 'select' | 'line' | 'pan' | 'shape',
	selections: [] as string[],
	editingLength: false,
	constraints: {
		snapCorners: true,
		angles: true,
	},
	shapeType: 'rectangle' as FloorShapesValueType,
});

export function toggleSelection(id: string, multi = false) {
	if (editorState.selections.includes(id)) {
		editorState.selections = editorState.selections.filter((s) => s !== id);
	} else {
		if (multi) {
			editorState.selections.push(id);
		} else {
			editorState.selections = [id];
		}
	}
}

(window as any).debugEditorState = () => {
	console.log('editorState', JSON.stringify(editorState));
};
