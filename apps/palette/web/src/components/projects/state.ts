import { proxy } from 'valtio';

export const toolState = proxy({
	showBubbles: true,
	pickingColor: null as string | null,
});
