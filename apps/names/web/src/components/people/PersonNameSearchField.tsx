import { hooks, useAddPerson } from '@/hooks.js';
import { Box, clsx, Icon, Input, Popover } from '@a-type/ui';
import { preventDefault } from '@a-type/utils';
import { Person } from '@names.biscuits/verdant';
import { useCombobox } from 'downshift';
import { Suspense, useDeferredValue, useState } from 'react';
import { TagDisplay } from '../tags/TagDisplay.jsx';

export interface PersonNameSearchFieldProps {
	onSelect?: (personId: string, wasAdded: boolean) => void;
	placeholder?: string;
	className?: string;
	allowAdd?: boolean;
}

const ADD_TOKEN = { addPerson: true };
function isAddToken(v: any): v is typeof ADD_TOKEN {
	// This function checks if the value is the special token we use to indicate
	// that a new person should be added.
	return v && typeof v === 'object' && v.addPerson === true;
}

export function PersonNameSearchField({
	onSelect,
	placeholder,
	className,
	allowAdd,
}: PersonNameSearchFieldProps) {
	const [inputValue, setInputValue] = useState('');
	const deferredInput = useDeferredValue(inputValue);
	const matches = hooks.useAllPeople({
		index: {
			where: 'matchName',
			startsWith: deferredInput.toLowerCase(),
		},
		key: 'nameSearchFieldMatch',
		skip: deferredInput.length < 2,
	});

	const addPerson = useAddPerson();

	const items = allowAdd && inputValue ? [...matches, ADD_TOKEN] : matches;

	const {
		isOpen,
		getMenuProps,
		getItemProps,
		getInputProps,
		highlightedIndex,
		closeMenu,
	} = useCombobox<Person | typeof ADD_TOKEN>({
		items,
		onInputValueChange: ({ inputValue }) => setInputValue(inputValue),
		async onSelectedItemChange({ selectedItem }) {
			console.log('here', inputValue, selectedItem);
			if (selectedItem) {
				if (isAddToken(selectedItem)) {
					if (!inputValue) return;
					const newPerson = await addPerson(inputValue);
					onSelect?.(newPerson.get('id'), true);
				} else {
					onSelect?.(selectedItem.get('id'), false);
				}
			}
			setInputValue('');
		},
		itemToString: (item) => '',
		itemToKey: (item) => (isAddToken(item) ? 'add_person' : item?.get('id')),
		defaultHighlightedIndex: 0,
	});

	return (
		<Popover
			open={isOpen}
			onOpenChange={(v) => {
				if (!v) {
					closeMenu();
				}
			}}
		>
			<Popover.Anchor asChild>
				<Input
					{...getInputProps({
						placeholder: placeholder || 'Search names...',
						className,
					})}
				/>
			</Popover.Anchor>
			<Popover.Content
				{...getMenuProps()}
				className="w-[var(--radix-popper-anchor-width)]"
				onOpenAutoFocus={preventDefault}
				sideOffset={8}
				forceMount
			>
				{matches.map((person, index) => (
					<PersonItem
						key={person.get('id')}
						{...getItemProps({ item: person, index })}
						highlighted={highlightedIndex === index}
						person={person}
					/>
				))}
				{!matches.length && (
					<Box className="color-gray-dark text-sm p-2">
						{!!inputValue ? 'No matches' : 'Search people'}
					</Box>
				)}
				{allowAdd && !!inputValue && (
					<Box
						p="sm"
						className={clsx(
							highlightedIndex === items.length - 1 ? 'bg-gray-light' : '',
						)}
						{...getItemProps({ item: ADD_TOKEN, index: items.length - 1 })}
						items="center"
						gap
					>
						<Icon name="add_person" />
						New person: "{inputValue}"
					</Box>
				)}
			</Popover.Content>
		</Popover>
	);
}

function PersonItem({
	person,
	highlighted,
	...props
}: {
	person: Person;
	highlighted?: boolean;
}) {
	const { note, tags } = hooks.useWatch(person);

	return (
		<Box
			p="sm"
			{...props}
			className={clsx('rounded-sm', highlighted ? 'bg-gray-light' : '')}
			d="col"
			gap="xs"
		>
			<Box>{person.get('name')}</Box>
			{note && (
				<Box className="color-gray-dark text-sm" gap="sm" items="center">
					<Icon name="note" />
					{note}
				</Box>
			)}
			{tags && (
				<Suspense>
					<Box className="color-gray-dark text-sm" gap="sm" items="center">
						{tags.map((tag) => (
							<TagDisplay key={tag} name={tag} className="text-xs" />
						))}
					</Box>
				</Suspense>
			)}
		</Box>
	);
}
