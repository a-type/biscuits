import { hooks } from '@/hooks.js';
import { Box, clsx, Input, Popover } from '@a-type/ui';
import { preventDefault } from '@a-type/utils';
import { useCombobox } from 'downshift';
import { useDeferredValue, useState } from 'react';

export interface PersonNameSearchFieldProps {
	onSelect?: (personId: string) => void;
}

export function PersonNameSearchField({
	onSelect,
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
				<Input {...getInputProps({ placeholder: 'Search names...' })} />
			</Popover.Anchor>
			<Popover.Content
				{...getMenuProps()}
				className="w-[var(--radix-popper-anchor-width)]"
				onOpenAutoFocus={preventDefault}
				sideOffset={8}
			>
				{matches.map((person, index) => (
					<Box
						key={person.get('id')}
						p="sm"
						{...getItemProps({ item: person, index })}
						className={clsx(
							'rounded-sm',
							highlightedIndex === index ? 'bg-gray-2' : '',
						)}
					>
						{person.get('name')}
					</Box>
				))}
				{!matches.length && (
					<Box className="text-gray-7 text-sm p-2">No matches</Box>
				)}
			</Popover.Content>
		</Popover>
	);
}
