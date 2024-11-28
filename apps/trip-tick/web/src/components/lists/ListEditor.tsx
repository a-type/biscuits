import { firstList } from '@/onboarding/firstList.js';
import { hooks } from '@/store.js';
import {
	Button,
	CardGrid,
	H2,
	Icon,
	LiveUpdateTextField,
	toast,
} from '@a-type/ui';
import { debounce } from '@a-type/utils';
import { OnboardingTooltip } from '@biscuits/client';
import { List } from '@trip-tick.biscuits/verdant';
import { useSearchParams } from '@verdant-web/react-router';
import { forwardRef, useState } from 'react';
import { AddSuggested } from './AddSuggested.jsx';
import { ListEditorItem } from './ListEditorItem.jsx';

export interface ListEditorProps {
	list: List;
}

export function ListEditor({ list }: ListEditorProps) {
	const { name } = hooks.useWatch(list);
	const [editName, setEditName] = useState(!name || name === 'New List');

	hooks.useOnChange(
		list,
		(info) => {
			if (info.isLocal) showSaveToast();
		},
		{ deep: true },
	);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-row gap-1 items-center">
				{editName ?
					<LiveUpdateTextField
						value={name}
						onChange={(v) => list.set('name', v)}
						className="text-xl w-full"
						autoFocus={editName}
						onBlur={() => setEditName(false)}
						autoSelect
					/>
				:	<Button
						color="ghost"
						className="text-xl"
						onClick={() => setEditName(true)}
					>
						{name}
						<Icon className="ml-2" name="pencil" />
					</Button>
				}
			</div>
			<ListItemsEditor list={list} />
		</div>
	);
}

const showSaveToast = debounce(() => {
	toast.success('Changes saved', {
		id: 'saved',
		duration: 2000,
	});
}, 1000);

function ListItemsEditor({ list }: { list: List }) {
	const { items } = hooks.useWatch(list);
	hooks.useWatch(items);

	return (
		<div className="flex flex-col gap-4">
			<H2>Items</H2>
			<CardGrid>
				{items.map((item) => (
					<ListEditorItem
						item={item}
						onDelete={() => {
							items.removeAll(item);
						}}
						key={item.get('id')}
					/>
				))}
			</CardGrid>
			<OnboardingTooltip
				onboarding={firstList}
				step="addItem"
				content="Add your first item you want to pack"
			>
				<AddListItemButton list={list} />
			</OnboardingTooltip>
			<AddSuggested items={items} />
		</div>
	);
}

const AddListItemButton = forwardRef<HTMLButtonElement, { list: List }>(
	function AddListItemButton({ list }, ref) {
		const { items } = hooks.useWatch(list);
		const [_, setParams] = useSearchParams();

		return (
			<Button
				color="primary"
				className="self-center items-center justify-center"
				onClick={() => {
					items.push({
						description: 'New item',
					});
					const item = items.get(items.length - 1);
					setParams((p) => {
						p.set('item', item.get('id'));
						return p;
					});
				}}
				ref={ref}
			>
				Add Item
			</Button>
		);
	},
);
