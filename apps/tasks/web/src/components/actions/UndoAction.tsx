import { hooks } from '@/hooks.js';
import { ActionButton, Icon, Tooltip } from '@a-type/ui';

export function UndoAction({ showName }: { showName?: boolean }) {
	const canUndo = hooks.useCanUndo();
	const groceries = hooks.useClient();

	return (
		<Tooltip content={!canUndo ? 'Nothing to undo' : 'Undo'}>
			<ActionButton
				size="small"
				onClick={() => {
					groceries.undoHistory.undo();
				}}
				visuallyDisabled={!canUndo}
			>
				<Icon name="undo" />
				{showName ? 'Undo' : undefined}
			</ActionButton>
		</Tooltip>
	);
}
