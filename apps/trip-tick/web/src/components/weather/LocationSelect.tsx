import { hooks } from '@/store.js';
import { Button, Icon, Input, Popover, toast, useSize } from '@a-type/ui';
import { useDebounced, useHasServerAccess } from '@biscuits/client';
import { graphql, useClient, useQuery } from '@biscuits/graphql';
import { TripLocation, TripLocationInit } from '@trip-tick.biscuits/verdant';
import classNames from 'classnames';
import { useCombobox } from 'downshift';
import { useCallback, useRef, useState, useTransition } from 'react';

export interface LocationSelectProps {
	className?: string;
	value: TripLocation | null;
	onChange: (value: TripLocationInit) => void;
}

const locationAutocomplete = graphql(`
	query LocationAutocomplete($query: String!) {
		locationAutocomplete(search: $query) {
			placeId
			text
		}
	}
`);

const geographicLocation = graphql(`
	query GeographicLocation($placeId: String!) {
		geographicLocation(placeId: $placeId) {
			latitude
			longitude
			id
		}
	}
`);

export function LocationSelect({
	className,
	value,
	onChange,
}: LocationSelectProps) {
	const isSubscribed = useHasServerAccess();

	hooks.useWatch(value);

	const [showEdit, setShowEdit] = useState(false);

	const handleChange = useCallback(
		(v: TripLocationInit) => {
			onChange(v);
			setShowEdit(false);
		},
		[onChange],
	);

	if (!isSubscribed) return null;

	if (!showEdit && value) {
		return (
			<Button
				emphasis="ghost"
				size="small"
				className={classNames('font-normal', className)}
				onClick={() => setShowEdit(true)}
			>
				<Icon name="location" />
				{value.get('name')}
			</Button>
		);
	}

	return (
		<LocationSelectAutocomplete
			value={value}
			onChange={handleChange}
			className={className}
			autoFocus={showEdit}
		/>
	);
}

function LocationSelectAutocomplete({
	value,
	onChange,
	className,
	autoFocus,
}: {
	value: TripLocation | null;
	onChange: (value: TripLocationInit) => void;
	className?: string;
	autoFocus?: boolean;
}) {
	const name = value?.get('name') ?? '';

	const [_, startTransition] = useTransition();
	const [searchValue, setSearchValue] = useState(name);
	const debouncedSearchValue = useDebounced(searchValue, 500);

	const searchResult = useQuery(locationAutocomplete, {
		variables: { query: debouncedSearchValue },
		skip: !debouncedSearchValue || debouncedSearchValue === name,
	});
	const client = useClient();

	const options = searchResult.data?.locationAutocomplete ?? [];

	const {
		isOpen,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		setInputValue,
	} = useCombobox({
		items: options,
		initialInputValue: name,
		onInputValueChange({ inputValue }) {
			startTransition(() => {
				setSearchValue(inputValue || '');
			});
		},
		async onSelectedItemChange({ selectedItem, inputValue }) {
			if (selectedItem) {
				// we must now fetch the geocoded location
				const result = await client.query({
					query: geographicLocation,
					variables: {
						placeId: selectedItem.placeId,
					},
				});
				const data = result.data?.geographicLocation;

				if (data) {
					onChange({
						latitude: data.latitude,
						longitude: data.longitude,
						name: selectedItem.text,
					});
				} else {
					toast.error('Failed to fetch location details');
				}
			}
		},
		itemToString: (item) => {
			return item?.text ?? '';
		},
	});

	const contentRef = useRef<HTMLDivElement>(null);
	const innerRef = useSize<HTMLDivElement>(({ width }) => {
		if (contentRef.current) {
			contentRef.current.style.width = width + 'px';
		}
	});
	return (
		<Popover open={isOpen}>
			<div
				data-state={isOpen ? 'open' : 'closed'}
				className={classNames('flex gap-1 flex-col w-full relative', className)}
				ref={innerRef}
			>
				<label htmlFor="location-input" className="font-bold">
					Where are you going?
				</label>
				<Input
					data-test="location-input"
					id="location-input"
					{...getInputProps({
						placeholder: 'Raleigh, NC',
					})}
					className="flex-1"
					required
					autoComplete="off"
					name="location"
					autoFocus={autoFocus}
					autoSelect
				/>
			</div>
			<Popover.Content
				radius="md"
				align="start"
				forceMount
				initialFocus={false}
				{...getMenuProps({
					ref: contentRef,
				})}
				className={classNames(
					'overflow-x-hidden overflow-y-auto overscroll-contain shadow-lg',
				)}
				anchor={innerRef}
			>
				{options.map((item, index) => (
					<div
						key={item.placeId}
						{...getItemProps({ item, index })}
						className={classNames(
							'p-2 cursor-pointer flex flex-col',
							index === highlightedIndex && 'bg-gray-light',
						)}
					>
						<span className="">{item.text}</span>
					</div>
				))}
				{!options?.length && (
					<div className="px-2 text-center">No results found</div>
				)}
			</Popover.Content>
		</Popover>
	);
}
