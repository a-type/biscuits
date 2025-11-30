import { proxy } from 'valtio';

export const editorState = proxy({
	tool: 'select' as 'select' | 'line' | 'pan',
	selections: [] as string[],
	editingLength: false,
	constraints: {
		snapCorners: true,
		angles: true,
	},
});
