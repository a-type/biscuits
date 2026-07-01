import { firstList } from '@/onboarding/firstList.js';
import { hooks } from '@/store.js';
import {
	Box,
	Button,
	CardGrid,
	EditableText,
	Heading,
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
		<Box grow col gap="lg">
			<Box items="center" gap="xs">
				<Heading emphasis="primary" render={<h1 />}>
					<EditableText
						editing={editName}
						onEditingChange={setEditName}
						value={name}
						onValueChange={(v) => list.set('name', v)}
						autoSelect
					/>
				</Heading>
			</Box>
			<ListItemsEditor list={list} />
		</Box>
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
		<Box col grow gap>
			<Heading render={<h2 />}>Items</Heading>
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
		</Box>
	);
}

const AddListItemButton = forwardRef<HTMLButtonElement, { list: List }>(
	function AddListItemButton({ list }, ref) {
		const { items } = hooks.useWatch(list);
		const [_, setParams] = useSearchParams();

		return (
			<Button
				emphasis="primary"
				style={{
					position: 'sticky',
					bottom: 'var(--m-space)',
					alignSelf: 'center',
					alignItems: 'center',
					justifyContent: 'center',
				}}
				onClick={() => {
					items.push({
						description: 'New item',
					});
					const item = items.get(items.length - 1);
					setParams(
						(p) => {
							p.set('item', item.get('id'));
							return p;
						},
						{
							replace: true,
						},
					);
				}}
				ref={ref}
			>
				Add Item
			</Button>
		);
	},
);
