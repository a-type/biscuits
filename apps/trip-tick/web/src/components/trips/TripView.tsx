import { AddListsPicker } from '@/components/trips/AddListsPicker.jsx';
import { useTripDays, useTripProgress } from '@/components/trips/hooks.js';
import { hooks } from '@/store.js';
import {
	Button,
	CollapsibleSimple,
	H4,
	Icon,
	LiveUpdateTextField,
	TabsContent,
	TabsList,
	TabsRoot,
	TabsTrigger,
} from '@a-type/ui';
import { useLocalStorage, usePageTitle } from '@biscuits/client';
import { FragmentOf, graphql, useQuery } from '@biscuits/graphql';
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
import { TripGlobalProgress } from './TripGlobalProgress.jsx';
import { ExtraItem, ListItem } from './TripItem.jsx';
import { quantityForecast } from './utils.js';

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
		<div className="w-full flex flex-col gap-4">
			<TripViewInfo trip={trip} forecast={forecast} />
			<TripViewChecklists trip={trip} forecast={forecast} />
			<div className="fixed bottom-0 left-0 right-0 w-full p-1 bg-wash">
				<TripGlobalProgress trip={trip} />
			</div>
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
				'flex flex-col items-start ring-16px transition bg-primary-wash ring-primary-wash sm:rounded-md sm:ring-8px',
				{
					'gap-4': !startsAt || !endsAt,
					'gap-1': startsAt && endsAt,
				},
			)}
		>
			<div className="flex flex-row items-center gap-1">
				<Button emphasis="ghost" render={<Link to="/" />}>
					<Icon name="arrowLeft" />
					<span className="sr-only">Back to trips</span>
				</Button>
				{editName ?
					<LiveUpdateTextField
						value={name}
						onChange={(v) => trip.set('name', v)}
						className="w-full text-xl"
						autoFocus={editName}
						onBlur={() => setEditName(false)}
						autoSelect
					/>
				:	<Button
						emphasis="ghost"
						className="text-xl"
						onClick={() => setEditName(true)}
					>
						{name}
						<Icon className="ml-2" name="pencil" />
					</Button>
				}
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
			<div className="mt-8 w-full flex flex-1 flex-col items-center justify-center color-gray-dark">
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
			<div className="mb-4 display-unset">
				<div className="flex flex-row items-center gap-2 px-2">
					<H4 className="flex-1">
						{editingLists ?
							startedWithNoLists ?
								'Add lists'
							:	'Edit lists'
						:	'Lists'}
					</H4>
					<Button
						className="m-1 flex-0-0-auto"
						size={editingLists ? 'small' : 'default'}
						color="accent"
						emphasis={editingLists ? 'primary' : 'ghost'}
						onClick={() => setEditingLists((v) => !v)}
					>
						{editingLists ?
							<>
								Done <div className="i-solar-check-circle-linear" />
							</>
						:	<div className="i-solar-settings-linear" />}
					</Button>
				</div>
				<CollapsibleSimple open={editingLists}>
					<AddListsPicker trip={trip} className="p-2" />
				</CollapsibleSimple>
				<TabsList className="sticky top-0 z-2 w-full overflow-y-hidden border-none shadow-none bg-wash overflow-x-auto important:justify-start">
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
			{startedWithNoLists && !mappedLists.length && (
				<div className="w-full p-4 italic color-gray-dark">
					<span className="[font-style:normal]">💡</span> Add lists to this trip
					for everything you want to pack. Once you start packing, check off
					items as you go.
				</div>
			)}
		</TabsRoot>
	);
}

function ListTab({ trip, list }: { list: List; trip: Trip }) {
	const { value } = useTripProgress(trip, { listFilter: [list.get('id')] });
	return (
		<TabsTrigger
			value={list.get('id')}
			className="relative z-1 flex-shrink-0 overflow-hidden"
		>
			<span className="text-nowrap">{list.get('name')}</span>
			<Progress.Root
				value={value}
				className="absolute bottom-0 left-2 right-2 z-1 overflow-hidden border rounded-full border-l-solid border-r-solid border-t-solid border-primary"
			>
				<Progress.Indicator
					className="h-4px w-full bg-accent"
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
	const { items, id: listId } = hooks.useWatch(list);
	hooks.useWatch(items);
	hooks.useWatch(completions);
	hooks.useWatch(extraItems);

	let extraItemsForList = extraItems.get(listId) ?? null;
	hooks.useWatch(extraItemsForList);
	if (Array.isArray(extraItemsForList)) {
		// workaround Verdant bug #371
		extraItemsForList = null;
	}

	return (
		<div className="flex flex-col">
			<ul className="m-0 mb-6 flex flex-col list-none gap-1 p-0">
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
				<p className="text-sm italic color-gray-dark">
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
