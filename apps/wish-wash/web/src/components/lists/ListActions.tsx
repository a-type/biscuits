import { RedoAction } from '@/components/actions/RedoAction.js';
import { UndoAction } from '@/components/actions/UndoAction.js';
import { ActionBar, clsx } from '@a-type/ui';
import { List } from '@wish-wash.biscuits/verdant';
import { ListPublishAction } from './ListPublishAction.jsx';
import { ReorderAction } from './ReorderAction.jsx';

export interface ListActionsProps {
	className?: string;
	list: List;
}

export function ListActions({ className, list }: ListActionsProps) {
	return (
		<ActionBar className={clsx('bg-wash', className)}>
			<UndoAction />
			<RedoAction />
			<ListPublishAction list={list} />
			<ReorderAction />
		</ActionBar>
	);
}
