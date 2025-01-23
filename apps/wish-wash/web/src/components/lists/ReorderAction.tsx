import { ActionButton, Icon } from '@a-type/ui';
import { useReordering } from './hooks.js';

export interface ReorderActionProps {
	className?: string;
}

export function ReorderAction({ className }: ReorderActionProps) {
	const [reordering, setReordering] = useReordering();

	return (
		<ActionButton
			onClick={() => setReordering(!reordering)}
			className={className}
		>
			<Icon name="convert" />
			{reordering ? 'Done' : 'Reorder'}
		</ActionButton>
	);
}
