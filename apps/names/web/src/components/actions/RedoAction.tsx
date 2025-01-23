import { hooks } from '@/hooks.js';
import { ActionButton, Icon } from '@a-type/ui';

export function RedoAction({ showName }: { showName?: boolean }) {
	const canRedo = hooks.useCanRedo();
	const client = hooks.useClient();

	return (
		<ActionButton
			size="small"
			onClick={() => {
				client.undoHistory.redo();
			}}
			visible={canRedo}
		>
			<Icon name="undo" className="-scale-x-100" />
			{showName ? 'Undo' : undefined}
		</ActionButton>
	);
}
