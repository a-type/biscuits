import { useListId } from '@/contexts/ListContext.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	clsx,
	CollapsibleContent,
	CollapsibleRoot,
	Icon,
	Tooltip,
} from '@a-type/ui';
import { Item } from '@gnocchi.biscuits/verdant';
import { Link } from '@verdant-web/react-router';
import { useListOrNull, useListThemeClass } from './hooks.js';
import cls from './ListTag.module.css';

export function ListTag({
	item,
	collapsed,
	className,
}: {
	item: Item;
	collapsed?: boolean;
	className?: string;
}) {
	const filteredListId = useListId();

	const { listId } = hooks.useWatch(item);

	const list = useListOrNull(listId);
	const listThemeClass = useListThemeClass(listId);

	if (filteredListId !== undefined) {
		// only show list tag when showing all items
		return null;
	}

	if (!list) {
		return null;
	}

	const name = list.get('name');

	return (
		<Tooltip content={list.get('name')}>
			<CollapsibleRoot open={!collapsed} className={className}>
				<CollapsibleContent data-horizontal className={cls.root}>
					<Link to={`/list/${list.get('id')}`} className={cls.link}>
						<div className={clsx(listThemeClass, cls.linkContent)}>
							<Icon name="tag" filled style={{ display: 'inline' }} />
							<span className={cls.name}>{name}</span>
							<span className={cls.initials}>
								{getInitials(name).toUpperCase()}
							</span>
						</div>
					</Link>
				</CollapsibleContent>
			</CollapsibleRoot>
		</Tooltip>
	);
}

function getInitials(name: string) {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('');
}
