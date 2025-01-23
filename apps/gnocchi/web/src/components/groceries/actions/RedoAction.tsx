import { hooks } from '@/stores/groceries/index.js';
import { ActionButton, Icon } from '@a-type/ui';

export function RedoAction({ showName }: { showName?: boolean }) {
	const canRedo = hooks.useCanRedo();
	const groceries = hooks.useClient();

	return (
		<ActionButton
			size="small"
			onClick={() => {
				groceries.undoHistory.redo();
			}}
			visible={canRedo}
		>
			<Icon name="undo" className="-scale-x-100" />
			{showName ? 'Redo' : undefined}
		</ActionButton>
	);
}
