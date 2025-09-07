import { hooks } from '@/hooks.js';
import { useLocalStorage } from '@biscuits/client';

export function useLastFloorId() {
	return useLocalStorage('lastFloorId', null as string | null);
}

export function useInitialFloorId() {
	const [lastFloorId] = useLastFloorId();
	const anyFloor = hooks.useOneFloor({
		skip: !!lastFloorId,
	});
	return lastFloorId ?? anyFloor?.get('id') ?? null;
}
