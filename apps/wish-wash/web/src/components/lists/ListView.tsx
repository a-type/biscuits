import { clsx } from '@a-type/ui';
import {
	Card,
	CardContent,
	CardGrid,
	cardGridColumns,
	CardMain,
	CardTitle,
} from '@a-type/ui/components/card';
import { List } from '@wish-wash.biscuits/verdant';
import { ReactNode, Suspense } from 'react';
import { useItemSize } from '../items/hooks.js';
import { ItemEditDialog } from '../items/ItemEditDialog.jsx';
import { ListItem } from '../items/ListItem.jsx';
import { CreateItem } from './CreateItem.jsx';
import { ItemSorter } from './ItemSorter.jsx';
import { hooks } from '@/hooks.js';
import { Icon, IconName } from '@a-type/ui/components/icon';

export interface ListViewProps {
	list: List;
	className?: string;
}

function largeColumns(size: number) {
	if (size > 2000) {
		return 5;
	}
	if (size > 1500) {
		return 4;
	}
	if (size > 1000) {
		return 3;
	}
	if (size > 500) {
		return 2;
	}
	return 1;
}

function smallColumns(size: number) {
	if (size > 2000) {
		return 7;
	}
	if (size > 1500) {
		return 6;
	}
	if (size > 1000) {
		return 5;
	}
	if (size > 750) {
		return 4;
	}
	if (size > 500) {
		return 3;
	}
	return 2;
}

export function ListView({ list, className }: ListViewProps) {
	const { items } = hooks.useWatch(list);
	hooks.useWatch(items);
	const [itemSize] = useItemSize();

	return (
		<div className={clsx('col items-stretch gap-4', className)}>
			<CreateItem className="sticky top-4 z-10 self-center" list={list} />
			<div className="row items-stretch">
				<div className="flex-1">
					<CardGrid
						columns={itemSize === 'large' ? largeColumns : smallColumns}
						className="flex-1"
					>
						{items.map((item) => (
							<ListItem item={item} key={item.get('id')} />
						))}
						{items.length === 0 && <TutorialCards />}
					</CardGrid>
				</div>
				<ItemSorter list={list} />
			</div>
			<Suspense>
				<ItemEditDialog list={list} />
			</Suspense>
		</div>
	);
}

function TutorialCards() {
	return (
		<>
			<Card>
				<CardMain>
					<CardTitle>Add items to your list</CardTitle>
					<CardContent>
						Use the buttons above to add your first item. Wish Wash has several
						types of items...
					</CardContent>
				</CardMain>
			</Card>
			<TutorialCard theme="lemon" title="Ideas" icon="lightbulb">
				Ideas are things you know you want, but don't have a particular example
				for. Like, "a black dress" or "a phone case"&mdash;maybe you don't care
				which one, or just don't know yet.
			</TutorialCard>
			<TutorialCard theme="leek" title="Products" icon="gift">
				Products are specific things, with a link to a store page to buy it.
			</TutorialCard>
			<TutorialCard theme="eggplant" title="Vibes" icon="magic">
				Vibes help to describe your aesthetic&mdash;just the general feeling or
				style of things you like. Vibes help others find creative and
				spontaneous gifts.
			</TutorialCard>
		</>
	);
}

function TutorialCard({
	title,
	children,
	theme,
	icon,
}: {
	theme: string;
	title: string;
	children: ReactNode;
	icon: IconName;
}) {
	return (
		<Card
			className={clsx(`theme-${theme}`, 'bg-primary-wash color-primary-dark')}
		>
			<CardMain>
				<CardContent
					unstyled
					className="flex flex-row items-center gap-3 p-3 font-bold text-lg"
				>
					<Icon className="w-[30px] h-[30px] [stroke-width:0.3]" name={icon} />
					{title}
				</CardContent>
				<CardContent unstyled className="p-2">
					{children}
				</CardContent>
			</CardMain>
		</Card>
	);
}
