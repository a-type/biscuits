import { proxy } from 'valtio';

export const editorState = proxy({
	tool: 'select' as 'select' | 'line' | 'pan' | 'attachments',
	selections: [] as string[],
	editingLength: false,
	constraints: {
		snapCorners: true,
		angles: true,
	},
	activeAttachment: 'door' as 'door' | 'window',
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
