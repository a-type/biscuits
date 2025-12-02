import { Floor } from '@floorplan.biscuits/verdant';
import { createContext, useContext } from 'react';

const Ctx = createContext<Floor | null>(null);

export const FloorProvider = Ctx.Provider;

export function useFloor() {
	const floor = useContext(Ctx);
	if (!floor) {
		throw new Error('useFloor must be used within a FloorProvider');
	}
	return floor;
}
