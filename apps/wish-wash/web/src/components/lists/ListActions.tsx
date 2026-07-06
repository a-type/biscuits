import { RedoAction } from '@/components/actions/RedoAction.js';
import { UndoAction } from '@/components/actions/UndoAction.js';
import { ActionBar } from '@a-type/ui';
import { List } from '@wish-wash.biscuits/verdant';
import { CSSProperties } from 'react';
import { ListPublishAction } from './ListPublishAction.jsx';
import { ReorderAction } from './ReorderAction.jsx';

export interface ListActionsProps {
	className?: string;
	list: List;
	style?: CSSProperties;
}

export function ListActions({ className, list, style }: ListActionsProps) {
	return (
		<ActionBar className={className} style={style}>
			<UndoAction />
			<RedoAction />
			<ListPublishAction list={list} />
			<ReorderAction />
		</ActionBar>
	);
}
