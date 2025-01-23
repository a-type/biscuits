import { createContext } from 'react';

export const InstructionsContext = createContext<{
	isEditing: boolean;
	hasPeers: boolean;
}>({
	isEditing: false,
	hasPeers: false,
});
