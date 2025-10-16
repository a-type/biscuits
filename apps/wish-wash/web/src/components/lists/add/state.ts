import { proxy } from 'valtio';

export const addState = proxy({
	prefilled: null as {
		name?: string;
		url?: string;
		description?: string;
	} | null,
});

(window as any).debugAddState = () => console.log(JSON.stringify(addState));
