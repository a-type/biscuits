import { ProjectColorsItemInit } from '@palette.biscuits/verdant';
import { proxy } from 'valtio';

export const toolState = proxy({
	showBubbles: true,
	pickedColor: null as ProjectColorsItemInit | null,
	activelyPicking: false,
});
