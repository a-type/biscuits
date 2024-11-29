import { ThemeName } from '@a-type/ui';
import { proxy } from 'valtio';

export const globalState = proxy({
	theme: 'lemon' as ThemeName,
});
