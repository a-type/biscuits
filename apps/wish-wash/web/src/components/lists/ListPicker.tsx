import { hooks } from '@/hooks.js';
import { Button, clsx, HorizontalList, Icon } from '@a-type/ui';
import { useLocalStorage } from '@biscuits/client';
import { Link } from '@verdant-web/react-router';
import { List } from '@wish-wash.biscuits/verdant';
import { useEffect, useRef } from 'react';
import { CreateListButton } from './CreateListButton.jsx';

export interface ListPickerProps {
	className?: string;
	value: string;
}

export function ListPicker({ className, value, ...props }: ListPickerProps) {
	const [open, setOpen] = useLocalStorage('list-picker-open', false);
	return (
		<div {...props} className={clsx('relative w-full', className)}>
			<HorizontalList
				className="w-full min-w-0 rounded-lg"
				open={open}
				onOpenChange={setOpen}
			>
				<ListsPickerLists value={value} />
				<CreateListButton
					emphasis="default"
					// className="sticky right-2 bottom-2 ml-auto"
				>
					<Icon name="plus" />
				</CreateListButton>
			</HorizontalList>
		</div>
	);
}

function ListsPickerLists({ value }: { value: string }) {
	const lists = hooks.useAllLists();

	// sort by recently created, with current value first
	const sorted = lists.sort((a, b) => a.get('createdAt') - b.get('createdAt'));

	return (
		<>
			{sorted.map((list) => (
				<ListPickerListButton
					selected={value === list.get('id')}
					list={list}
					key={list.uid}
				/>
			))}
		</>
	);
}

function ListPickerListButton({
	list,
	selected,
}: {
	list: List;
	selected: boolean;
}) {
	const ref = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		if (selected) {
			ref.current?.scrollIntoView({
				behavior: 'smooth',
				inline: 'center',
				block: 'center',
			});
		}
	}, [selected]);

	return (
		<Button
			size="small"
			color="accent"
			emphasis={selected ? 'light' : 'ghost'}
			// className={clsx(selected && 'sticky left-2 right-12 z-1')}
			ref={ref}
			render={<Link to={`/${list.get('id')}`} />}
		>
			<Icon name={list.isAuthorized ? 'lock' : 'add_person'} />{' '}
			{list.get('name')}
		</Button>
	);
}
