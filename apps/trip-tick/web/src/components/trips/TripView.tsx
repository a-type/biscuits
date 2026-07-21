import { AddListsPicker } from '@/components/trips/AddListsPicker.jsx';
import { useTripDays, useTripProgress } from '@/components/trips/hooks.js';
import { hooks } from '@/store.js';
import {
	Box,
	Button,
	CollapsibleSimple,
	EditableText,
	Heading,
	Icon,
	P,
	TabsContent,
	TabsList,
	TabsRoot,
	TabsTrigger,
	Text,
	Ul,
} from '@a-type/ui';
import { Link, useLocalStorage, usePageTitle } from '@biscuits/client';

import { FragmentOf, graphql, useQuery } from '@biscuits/graphql';
import * as Progress from '@radix-ui/react-progress';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
	List,
	Trip,
	TripCompletions,
	TripExtraItems,
} from '@trip-tick.biscuits/verdant';

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
import cls from './TripView.module.css';
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
		<Box full="width" col gap>
			<TripViewInfo trip={trip} forecast={forecast} />
			<TripViewChecklists trip={trip} forecast={forecast} />
			<Box
				style={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					width: '100%',
				}}
				surface="ambient"
				p="xs"
			>
				<TripGlobalProgress trip={trip} />
			</Box>
		</Box>
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
		<Box
			gap={!startsAt || !endsAt ? 'lg' : 'md'}
			className={classNames(cls.tripHeader)}
		>
			<Box items="center" gap="xs">
				<Button
					emphasis="ghost"
					aria-label="Back to trips"
					render={<Link to="/" />}
				>
					<Icon name="arrowLeft" />
				</Button>
				<Heading>
					<EditableText
						value={name}
						onValueChange={(v) => trip.set('name', v)}
						editing={editName}
						onEditingChange={setEditName}
					/>
				</Heading>
			</Box>
			<TripDateRange trip={trip} />
			<LocationSelect
				value={location}
				onChange={(v) => trip.set('location', v)}
			/>
			{forecast && <WeatherForecast forecast={forecast} />}
		</Box>
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

	const search = useSearch({ strict: false }) as Record<string, string>;
	const navigate = useNavigate();
	const activeList = (search.list ?? lists.get(0)) || '';

	const [editingLists, setEditingLists] = useState(lists.length === 0);
	const [startedWithNoLists] = useState(editingLists);

	if (!days) {
		return (
			<Box full="width" grow col layout="center" dim p="lg">
				<div>Select dates to get started</div>
			</Box>
		);
	}

	return (
		<TabsRoot
			value={activeList}
			onValueChange={(val) => {
				navigate({
					replace: true,
					search: (prev) => ({ ...prev, list: val }) as never,
				});
			}}
		>
			<div className={cls.tabsHeaderRoot}>
				<div className={cls.tabsHeader}>
					<Text bold render={<h4 />} style={{ flex: 1 }}>
						{editingLists ?
							startedWithNoLists ?
								'Add lists'
							:	'Edit lists'
						:	'Lists'}
					</Text>
					<Button
						className={cls.tabsToggle}
						size={editingLists ? 'small' : 'default'}
						color="accent"
						emphasis={editingLists ? 'primary' : 'ghost'}
						onClick={() => setEditingLists((v) => !v)}
					>
						{editingLists ?
							<>
								Done <Icon name="check" />
							</>
						:	<Icon name="gear" />}
					</Button>
				</div>
				<CollapsibleSimple open={editingLists}>
					<Box p="sm">
						<AddListsPicker trip={trip} />
					</Box>
				</CollapsibleSimple>
				<CollapsibleSimple open={!editingLists}>
					<TabsList className={cls.tabsList}>
						{mappedLists.map((list) => (
							<ListTab list={list} key={list.get('id')} trip={trip} />
						))}
					</TabsList>
				</CollapsibleSimple>
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
				<div className={cls.tabsEmpty}>
					<span style={{ fontStyle: 'normal' }}>💡</span> Add lists to this trip
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
		<TabsTrigger value={list.get('id')} className={cls.tab}>
			<span className={cls.tabText}>{list.get('name')}</span>
			<Progress.Root value={value} className={cls.tabProgress}>
				<Progress.Indicator
					className={cls.tabProgressIndicator}
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
		<Box col>
			<Ul unstyled>
				{items.map((item) => {
					const completion = completions.get(item.get('id')) ?? 0;
					return (
						<Ul.Item key={item.get('id')}>
							<ListItem
								item={item}
								days={days}
								completion={completion}
								onCompletionChanged={(value) => {
									completions.set(item.get('id'), value);
								}}
								forecast={forecast}
							/>
						</Ul.Item>
					);
				})}
				{extraItemsForList?.map((item) => {
					const completion = completions.get(item.get('id')) ?? 0;
					return (
						<Ul.Item key={item.get('id')}>
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
						</Ul.Item>
					);
				})}
			</Ul>
			<Box col gap p>
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
					align="start"
				>
					<Icon name="plus" /> Add item
				</Button>
				<P emphasis="ambient" italic dim>
					New items are only applied to this trip.{' '}
					<Text bold>
						<Link to="/lists/$listId" params={{ listId: list.get('id') }}>
							Edit the list
						</Link>
					</Text>{' '}
					if you want them for future trips.
				</P>
			</Box>
		</Box>
	);
}
