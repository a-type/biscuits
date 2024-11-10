import { proxy } from 'valtio';

export const toolState = proxy({
	tool: null as 'bubble' | null,
	showBubbles: true,
	pickingColor: null as string | null,
});
