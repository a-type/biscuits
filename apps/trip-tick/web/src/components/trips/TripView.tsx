import { AddListsPicker } from '@/components/trips/AddListsPicker.jsx';
import { useTripDays, useTripProgress } from '@/components/trips/hooks.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { CollapsibleSimple } from '@a-type/ui/components/collapsible';
import { Icon } from '@a-type/ui/components/icon';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@a-type/ui/components/tabs';
import { H4 } from '@a-type/ui/components/typography';
import {
  FragmentOf,
  graphql,
  useCanSync,
  useLocalStorage,
  usePageTitle,
  useQuery,
} from '@biscuits/client';
import * as Progress from '@radix-ui/react-progress';
import {
  List,
  Trip,
  TripCompletions,
  TripExtraItems,
} from '@trip-tick.biscuits/verdant';
import { Link, useSearchParams } from '@verdant-web/react-router';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { LocationSelect } from '../weather/LocationSelect.jsx';
import {
  WeatherForecast,
  forecast as forecastFragment,
} from '../weather/WeatherForecast.jsx';
import { TripDateRange } from './TripDateRange.jsx';
import { ExtraItem, ListItem } from './TripItem.jsx';
import { quantityForecast } from './utils.js';
import { TemperatureUnit } from '../weather/TemperatureUnit.jsx';
import { useTemperatureUnit } from '../weather/useTemperatureUnit.js';

export interface TripViewProps {
  tripId: string;
}

export function TripView({ tripId }: TripViewProps) {
  const trip = hooks.useTrip(tripId);
  usePageTitle(trip?.get('name') ?? 'Trip');

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return <TripViewImpl trip={trip} />;
}

const weather = graphql(
  `
    query Weather($input: WeatherForecastInput!) {
      weatherForecast(input: $input) {
        ...Forecast
        ...QuantityForecast
      }
    }
  `,
  [forecastFragment, quantityForecast],
);

function formatDate(date: number) {
  return new Date(date).toISOString().split('T')[0];
}
function useWeather(trip: Trip) {
  const { location, startsAt, endsAt, id } = hooks.useWatch(trip);
  hooks.useWatch(location);
  const latitude = location?.get('latitude') || 0;
  const longitude = location?.get('longitude') || 0;

  const { data } = useQuery(weather, {
    variables: {
      input: {
        endDate: formatDate(endsAt ?? 0),
        startDate: formatDate(startsAt ?? 0),
        latitude,
        longitude,
        // matches list config values. will be converted for display.
        temperatureUnits: 'Kelvin',
      },
    },
    skip: !latitude || !longitude || !startsAt || !endsAt,
  });

  const forecastData = data?.weatherForecast;

  const [cached, setCached] = useLocalStorage(
    `weather-${id}`,
    forecastData,
    true,
  );
  useEffect(() => {
    if (forecastData) {
      setCached(forecastData);
    }
  }, [forecastData, setCached]);

  const forecast = forecastData ?? cached;

  return { forecast };
}

function TripViewImpl({ trip }: { trip: Trip }) {
  const { forecast } = useWeather(trip);

  return (
    <div className="flex flex-col gap-4 w-full">
      <TripViewInfo trip={trip} forecast={forecast} />
      <TripViewChecklists trip={trip} forecast={forecast} />
    </div>
  );
}

function TripViewInfo({
  trip,
  forecast,
}: {
  trip: Trip;
  forecast?: FragmentOf<typeof forecastFragment>;
}) {
  const { name, startsAt, endsAt, location } = hooks.useWatch(trip);
  const [editName, setEditName] = useState(!name || name === 'New Trip');
  return (
    <div
      className={classNames(
        'flex flex-col items-start transition sm:rounded-md bg-primary-wash ring-16px sm:ring-8px ring-primary-wash',
        {
          'gap-4': !startsAt || !endsAt,
          'gap-1': startsAt && endsAt,
        },
      )}
    >
      <div className="flex flex-row gap-1 items-center">
        <Button asChild color="ghost" size="icon">
          <Link to="/">
            <Icon name="arrowLeft" />
            <span className="sr-only">Back to trips</span>
          </Link>
        </Button>
        {editName ? (
          <LiveUpdateTextField
            value={name}
            onChange={(v) => trip.set('name', v)}
            className="text-xl w-full"
            autoFocus={editName}
            onBlur={() => setEditName(false)}
          />
        ) : (
          <Button
            color="ghost"
            className="text-xl"
            onClick={() => setEditName(true)}
          >
            {name}
            <Icon className="ml-2" name="pencil" />
          </Button>
        )}
      </div>
      <TripDateRange trip={trip} />
      <LocationSelect
        value={location}
        onChange={(v) => trip.set('location', v)}
      />
      {forecast && <WeatherForecast forecast={forecast} />}
    </div>
  );
}

function TripViewChecklists({
  trip,
  forecast,
}: {
  trip: Trip;
  forecast?: FragmentOf<typeof quantityForecast>;
}) {
  const { lists, completions, extraItems } = hooks.useWatch(trip);
  const days = useTripDays(trip);
  hooks.useWatch(lists);
  hooks.useWatch(extraItems);
  const allLists = hooks.useAllLists();

  const mappedLists = lists
    .map((id) => allLists.find((l) => l.get('id') === id))
    .filter(function nonNil<T>(x: T | undefined): x is T {
      return x !== undefined;
    });

  const [params, setParams] = useSearchParams();
  const activeList = (params.get('list') ?? lists.get(0)) || '';

  const [editingLists, setEditingLists] = useState(lists.length === 0);
  const [startedWithNoLists] = useState(editingLists);

  if (!days) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center text-gray-7 mt-8">
        <div>Select dates to get started</div>
      </div>
    );
  }

  return (
    <TabsRoot
      value={activeList}
      onValueChange={(val) => {
        setParams((params) => {
          params.set('list', val);
          return params;
        });
      }}
    >
      <div className="display-unset mb-4">
        <div className="flex flex-row gap-2 items-center px-2">
          <H4 className="flex-1">
            {editingLists
              ? startedWithNoLists
                ? 'Add lists'
                : 'Edit lists'
              : 'Lists'}
          </H4>
          <Button
            className="flex-0-0-auto m-1"
            size={editingLists ? 'small' : 'icon'}
            color={editingLists ? 'accent' : 'ghost'}
            onClick={() => setEditingLists((v) => !v)}
          >
            {editingLists ? (
              <>
                Done <div className="i-solar-check-circle-linear" />
              </>
            ) : (
              <div className="i-solar-settings-linear" />
            )}
          </Button>
        </div>
        <CollapsibleSimple open={editingLists}>
          <AddListsPicker trip={trip} className="p-2" />
        </CollapsibleSimple>
        <TabsList className="important:justify-start sticky top-0 z-2 bg-wash">
          {mappedLists.map((list) => (
            <ListTab list={list} key={list.get('id')} trip={trip} />
          ))}
        </TabsList>
      </div>
      {mappedLists.map((list) => {
        const listId = list.get('id');
        return (
          <TabsContent key={list.get('id')} value={list.get('id')}>
            <TripViewChecklist
              key={listId}
              list={list}
              days={days}
              completions={completions}
              extraItems={extraItems}
              forecast={forecast}
            />
          </TabsContent>
        );
      })}
    </TabsRoot>
  );
}

function ListTab({ trip, list }: { list: List; trip: Trip }) {
  const { value } = useTripProgress(trip, { listFilter: [list.get('id')] });
  return (
    <TabsTrigger value={list.get('id')} className="relative overflow-hidden">
      <span>{list.get('name')}</span>
      <Progress.Root className="w-full absolute bottom-0 left-0 overflow-hidden rounded-b-full border border-t-solid border-t-primary">
        <Progress.Indicator
          className="bg-accent w-full h-4px"
          style={{
            transform: `translateX(-${100 * (1 - value)}%)`,
          }}
        />
      </Progress.Root>
    </TabsTrigger>
  );
}

function TripViewChecklist({
  list,
  days,
  completions,
  extraItems,
  forecast,
}: {
  list: List;
  days: number;
  completions: TripCompletions;
  extraItems: TripExtraItems;
  forecast?: FragmentOf<typeof quantityForecast>;
}) {
  const {
    items,
    id: listId,
    hotThreshold,
    coldThreshold,
  } = hooks.useWatch(list);
  hooks.useWatch(items);
  hooks.useWatch(completions);
  hooks.useWatch(extraItems);
  const isSubscribed = useCanSync();
  const { toDisplay } = useTemperatureUnit();

  let extraItemsForList = extraItems.get(listId) ?? null;
  hooks.useWatch(extraItemsForList);
  if (Array.isArray(extraItemsForList)) {
    // workaround Verdant bug #371
    extraItemsForList = null;
  }

  return (
    <div className="flex flex-col">
      {isSubscribed && (
        <div className="text-xs italic text-gray-7 flex flex-row gap-2 m-2">
          Hot days: {toDisplay(hotThreshold)}+ <TemperatureUnit />. Cold days:{' '}
          {toDisplay(coldThreshold)}- <TemperatureUnit />.{' '}
          <Link
            className="font-bold inline-flex items-center flex-row gap-2 ml-auto"
            to={`/lists/${list.get('id')}`}
          >
            Configure in list
            <Icon name="gear" />
          </Link>
        </div>
      )}
      <ul className="list-none flex flex-col gap-1 m-0 p-0 mb-6">
        {items.map((item) => {
          const completion = completions.get(item.get('id')) ?? 0;
          return (
            <li key={item.get('id')} className="m-0 p-0">
              <ListItem
                item={item}
                days={days}
                completion={completion}
                onCompletionChanged={(value) => {
                  completions.set(item.get('id'), value);
                }}
                forecast={forecast}
                hotThreshold={hotThreshold}
                coldThreshold={coldThreshold}
              />
            </li>
          );
        })}
        {extraItemsForList?.map((item) => {
          const completion = completions.get(item.get('id')) ?? 0;
          return (
            <li key={item.get('id')} className="m-0 p-0">
              <ExtraItem
                item={item}
                completion={completion}
                onCompletionChanged={(value) => {
                  completions.set(item.get('id'), value);
                }}
                onDelete={() => {
                  extraItemsForList?.removeAll(item);
                }}
              />
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => {
            if (!extraItemsForList) {
              extraItems.set(listId, [
                {
                  quantity: 1,
                },
              ]);
            } else {
              extraItemsForList.push({
                quantity: 1,
              });
            }
          }}
          size="small"
          className="self-start"
        >
          <Icon name="plus" /> Add item
        </Button>
        <p className="text-sm italic text-gray-7">
          New items are only applied to this trip.{' '}
          <Link className="font-bold" to={`/lists/${list.get('id')}`}>
            Edit the list
          </Link>{' '}
          if you want them for future trips.
        </p>
      </div>
    </div>
  );
}
