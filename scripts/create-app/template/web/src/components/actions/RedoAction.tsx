import { hooks } from '@/hooks.js';
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
			icon={<Icon name="undo" className="-scale-x-100" />}
			visible={canRedo}
		>
			{showName ? 'Undo' : undefined}
		</ActionButton>
	);
}
