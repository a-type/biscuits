import { proxy } from 'valtio';

export const globalState = proxy({
	theme: 'lemon',
});
