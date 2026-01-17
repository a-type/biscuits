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
				<CollapsibleContent
					data-horizontal
					className="focus-within:shadow-focus rounded-md focus-within:(outline-none)"
				>
					<Link
						to={`/list/${list.get('id')}`}
						className="focus-visible:outline-none"
					>
						<div
							className={clsx(
								listThemeClass,
								'min-h-3 min-w-3 flex items-center justify-center gap-1 rounded-md p-1 text-xs color-black bg-main-light lg:px-2',
							)}
						>
							<Icon name="tag" className="inline" />
							<span className="hidden max-w-full overflow-hidden text-ellipsis whitespace-nowrap lg:inline">
								{name}
							</span>
							<span className="inline max-w-full overflow-hidden text-ellipsis whitespace-nowrap lg:hidden">
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
