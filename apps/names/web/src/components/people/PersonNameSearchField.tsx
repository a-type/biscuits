import { hooks } from '@/hooks.js';
import { Box, clsx, Icon, Input, Popover } from '@a-type/ui';
import { preventDefault } from '@a-type/utils';
import { Person } from '@names.biscuits/verdant';
import { useCombobox } from 'downshift';
import { Suspense, useDeferredValue, useState } from 'react';
import { TagDisplay } from '../tags/TagDisplay.jsx';

export interface PersonNameSearchFieldProps {
	onSelect?: (personId: string) => void;
	placeholder?: string;
	className?: string;
}

export function PersonNameSearchField({
	onSelect,
	placeholder,
	className,
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

	const {
		isOpen,
		getMenuProps,
		getItemProps,
		getInputProps,
		highlightedIndex,
		closeMenu,
	} = useCombobox({
		items: matches,
		onInputValueChange: ({ inputValue }) => setInputValue(inputValue),
		async onSelectedItemChange({ selectedItem }) {
			if (selectedItem) {
				onSelect?.(selectedItem.get('id'));
			}
			setInputValue('');
		},
		itemToString: (item) => '',
		itemToKey: (item) => item?.get('id'),
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
					<Box className="text-gray-7 text-sm p-2">No matches</Box>
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
			key={person.get('id')}
			p="sm"
			{...props}
			className={clsx('rounded-sm', highlighted ? 'bg-gray-2' : '')}
			d="col"
			gap="xs"
		>
			<Box>{person.get('name')}</Box>
			{note && (
				<Box className="text-gray-7 text-sm" gap="sm" items="center">
					<Icon name="note" />
					{note}
				</Box>
			)}
			{tags && (
				<Suspense>
					<Box className="text-gray-7 text-sm" gap="sm" items="center">
						{tags.map((tag) => (
							<TagDisplay key={tag} name={tag} className="text-xs" />
						))}
					</Box>
				</Suspense>
			)}
		</Box>
	);
}
