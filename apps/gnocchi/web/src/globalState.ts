import { PaletteName } from '@a-type/ui';
import { proxy } from 'valtio';

export const globalState = proxy({
	theme: 'lemon' as PaletteName,
});
