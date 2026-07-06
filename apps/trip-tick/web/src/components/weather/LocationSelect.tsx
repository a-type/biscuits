import { hooks } from '@/store.js';
import { Button, Combobox, Field, Icon, toast } from '@a-type/ui';
import { useDebounced, useHasServerAccess } from '@biscuits/client';
import { graphql, useClient, useQuery } from '@biscuits/graphql';
import { TripLocation, TripLocationInit } from '@trip-tick.biscuits/verdant';
import classNames from 'classnames';
import { useCallback, useState, useTransition } from 'react';

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
				full="width"
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

const LocationCombobox = Combobox.create<{ placeId: string; text: string }>();

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

	return (
		<LocationCombobox
			items={options}
			inputValue={searchValue}
			onInputValueChange={(inputValue) => {
				startTransition(() => {
					setSearchValue(inputValue || '');
				});
			}}
			itemToStringLabel={(item) => item.text}
			itemToStringValue={(item) => item.placeId}
			onValueChange={async (selectedItem) => {
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
			}}
		>
			<Field id="location" stretch className={className}>
				<Field.Label>Where are you going?</Field.Label>
				<Field.Control
					render={
						<LocationCombobox.Input
							placeholder="Raleigh, NC"
							autoComplete="off"
							autoFocus={autoFocus}
						/>
					}
				/>
			</Field>
			<LocationCombobox.Content>
				<LocationCombobox.List>
					{(item) => (
						<LocationCombobox.Item value={item} key={item.placeId}>
							{item.text}
						</LocationCombobox.Item>
					)}
				</LocationCombobox.List>
			</LocationCombobox.Content>
			<LocationCombobox.Empty>No results</LocationCombobox.Empty>
		</LocationCombobox>
	);
}
