import { RedoAction } from '@/components/actions/RedoAction.js';
import { UndoAction } from '@/components/actions/UndoAction.js';
import { ActionBar, clsx } from '@a-type/ui';
import { ItemSizeAction } from './ItemSizeAction.jsx';
import { ListPublishAction } from './ListPublishAction.jsx';
import { ReorderAction } from './ReorderAction.jsx';

export interface ListActionsProps {
	className?: string;
	listId: string;
}

export function ListActions({ className, listId }: ListActionsProps) {
	return (
		<ActionBar className={clsx('bg-wash', className)}>
			<UndoAction />
			<RedoAction />
			<ListPublishAction listId={listId} />
			<ItemSizeAction />
			<ReorderAction />
		</ActionBar>
	);
}
