import { hooks } from '@/store.js';
import { Input } from '@a-type/ui/components/input/Input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@a-type/ui/components/popover';
import {
  graphql,
  useCanSync,
  useClient,
  useDebounced,
  useQuery,
} from '@biscuits/client';
import { TripLocation, TripLocationInit } from '@trip-tick.biscuits/verdant';
import classNames from 'classnames';
import { useCombobox } from 'downshift';
import { preventDefault } from '@a-type/utils';
import { useRef, useState, useTransition } from 'react';
import { useSize } from '@a-type/ui/hooks';
import { toast } from 'react-hot-toast';

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
  const isSubscribed = useCanSync();

  hooks.useWatch(value);
  const name = value?.get('name') ?? '';

  const [_, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(name);
  const debouncedSearchValue = useDebounced(searchValue, 500);

  const searchResult = useQuery(locationAutocomplete, {
    variables: { query: debouncedSearchValue },
    skip:
      !debouncedSearchValue || !isSubscribed || debouncedSearchValue === name,
  });
  const client = useClient();

  const options = searchResult.data?.locationAutocomplete ?? [];

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    reset,
    inputValue,
    setInputValue,
    selectItem,
    openMenu,
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
          setInputValue(selectedItem.text);
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
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useSize<HTMLDivElement>(({ width }) => {
    if (contentRef.current) {
      contentRef.current.style.width = width + 'px';
    }
  });

  if (!isSubscribed) return null;

  return (
    <Popover open={isOpen}>
      <PopoverAnchor asChild>
        <div
          data-state={isOpen ? 'open' : 'closed'}
          className={classNames(
            'flex gap-2 flex-row w-full relative',
            className,
          )}
          ref={innerRef}
        >
          <Input
            data-test="location-input"
            {...getInputProps({
              placeholder: 'Raleigh, NC',
            })}
            className="flex-1"
            required
            autoComplete="off"
            name="location"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        radius="md"
        align="start"
        forceMount
        onOpenAutoFocus={preventDefault}
        {...getMenuProps({
          ref: contentRef,
        })}
        className={classNames(
          'overflow-x-hidden overflow-y-auto overscroll-contain shadow-lg',
        )}
      >
        {options.map((item, index) => (
          <div
            key={item.placeId}
            {...getItemProps({ item, index })}
            className={classNames(
              'p-2 cursor-pointer flex flex-col',
              index === highlightedIndex && 'bg-gray-100',
            )}
          >
            <span className="">{item.text}</span>
          </div>
        ))}
        {!options && <div className="p-2 text-center">No results found</div>}
      </PopoverContent>
    </Popover>
  );
}
