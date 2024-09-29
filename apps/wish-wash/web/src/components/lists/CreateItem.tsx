import { hooks } from '@/hooks.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { useSearchParams } from '@verdant-web/react-router';
import { clsx } from '@a-type/ui';
import { withClassName } from '@a-type/ui/hooks';
import { List, ListItemsItemType } from '@wish-wash.biscuits/verdant';
import { typeIcons } from '@wish-wash.biscuits/common';

export interface CreateItemProps {
	className?: string;
	list: List;
}

export function CreateItem({ className, list }: CreateItemProps) {
	const { id: listId, items } = hooks.useWatch(list);
	const [_, setSearch] = useSearchParams();

	const createItem = async (type: ListItemsItemType) => {
		items.push({
			type,
		});
		const item = items.get(items.length - 1);

		setSearch((s) => {
			s.set('itemId', item.get('id'));
			return s;
		});
	};

	return (
		<div className={clsx('row justify-center gap-4 max-w-400px', className)}>
			<ItemButton
				onClick={() => createItem('idea')}
				color="primary"
				className="theme-lemon"
			>
				<ItemIcon name={typeIcons.idea} />+ idea
			</ItemButton>
			<ItemButton
				onClick={() => createItem('product')}
				color="primary"
				className="theme-leek"
			>
				<ItemIcon name={typeIcons.product} />+ product
			</ItemButton>
			<ItemButton
				onClick={() => createItem('vibe')}
				color="primary"
				className="theme-eggplant"
			>
				<ItemIcon name={typeIcons.vibe} />
				<span>+ vibe</span>
			</ItemButton>
		</div>
	);
}

const ItemButton = withClassName(
	Button,
	'rounded-lg [flex:1_0_0] min-w-80px aspect-square flex-col p-6 items-center justify-center [--bg:var(--color-primary-wash)]',
	'font-light',
);

const ItemIcon = withClassName(Icon, 'w-1/2 h-1/2 flex-1 stroke-width-0.3');
