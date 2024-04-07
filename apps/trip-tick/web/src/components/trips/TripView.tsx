import { AddListsPicker } from '@/components/trips/AddListsPicker.jsx';
import { useTripDays, useTripProgress } from '@/components/trips/hooks.js';
import { getComputedQuantity } from '@/components/trips/utils.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Checkbox, CheckboxRoot } from '@a-type/ui/components/checkbox';
import { CollapsibleSimple } from '@a-type/ui/components/collapsible';
import { Icon } from '@a-type/ui/components/icon';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
} from '@a-type/ui/components/popover';
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@a-type/ui/components/tabs';
import { H4 } from '@a-type/ui/components/typography';
import { useLongPress } from '@a-type/ui/hooks';
import * as Progress from '@radix-ui/react-progress';
import {
  List,
  ListItemsItem,
  Trip,
  TripCompletions,
  TripCompletionsValue,
  TripExtraItems,
  TripExtraItemsValue,
  TripExtraItemsValueItem,
} from '@trip-tick.biscuits/verdant';
import { Link, useSearchParams } from '@verdant-web/react-router';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { LocationSelect } from '../weather/LocationSelect.jsx';
import { WeatherForecast } from '../weather/WeatherForecast.jsx';
import { TripDateRange } from './TripDateRange.jsx';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import { useParticles } from '@a-type/ui/components/particles';
import { Divider } from '@a-type/ui/components/divider';

export interface TripViewProps {
  tripId: string;
}

export function TripView({ tripId }: TripViewProps) {
  const trip = hooks.useTrip(tripId);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <TripViewInfo trip={trip} />
      <TripViewChecklists trip={trip} />
    </div>
  );
}

function TripViewInfo({ trip }: { trip: Trip }) {
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
          <Link to="/trips">
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
      <WeatherForecast trip={trip} />
    </div>
  );
}

function TripViewChecklists({ trip }: { trip: Trip }) {
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
        <TabsList className="important:justify-start sticky top-0 z-2 bg-white">
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
}: {
  list: List;
  days: number;
  completions: TripCompletions;
  extraItems: TripExtraItems;
}) {
  const { items, id: listId } = hooks.useWatch(list);
  hooks.useWatch(items);
  hooks.useWatch(completions);
  hooks.useWatch(extraItems);

  let extraItemsForList = extraItems.get(listId) ?? null;
  if (Array.isArray(extraItemsForList)) {
    // workaround Verdant bug #371
    extraItemsForList = null;
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="list-none flex flex-col gap-4 m-0 p-0">
        {items.map((item) => {
          const completion = completions.get(item.get('id')) ?? 0;
          return (
            <li key={item.get('id')} className="m-0 p-0">
              <TripViewChecklistItem
                item={item}
                days={days}
                completion={completion}
                onCompletionChanged={(value) => {
                  completions.set(item.get('id'), value);
                }}
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
              />
            </li>
          );
        })}
      </ul>
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
  );
}

function TripViewChecklistItem({
  item,
  days,
  completion,
  onCompletionChanged,
}: {
  item: ListItemsItem;
  days: number;
  completion: TripCompletionsValue;
  onCompletionChanged: (completion: TripCompletionsValue) => void;
}) {
  const { description, perDays, quantity, additional, roundDown } =
    hooks.useWatch(item);
  const computedQuantity = getComputedQuantity({
    perDays,
    quantity,
    days,
    additional,
    roundDown,
  });

  return (
    <ChecklistItem
      description={description}
      completedQuantity={completion}
      computedQuantity={computedQuantity}
      onCompletionChanged={onCompletionChanged}
    />
  );
}

function ExtraItem({
  item,
  completion,
  onCompletionChanged,
}: {
  item: TripExtraItemsValueItem;
  completion: TripCompletionsValue;
  onCompletionChanged: (completion: TripCompletionsValue) => void;
}) {
  const { description, quantity } = hooks.useWatch(item);

  return (
    <ChecklistItem
      description={description}
      completedQuantity={completion}
      computedQuantity={quantity}
      onCompletionChanged={onCompletionChanged}
      onDescriptionChanged={(value) => item.set('description', value)}
      onQuantityChanged={(value) => item.set('quantity', value)}
    />
  );
}

function ChecklistItem({
  computedQuantity,
  completedQuantity,
  onCompletionChanged,
  description,
  onDescriptionChanged,
  onQuantityChanged,
}: {
  computedQuantity: number;
  completedQuantity: number;
  onCompletionChanged: (value: number) => void;
  description: string;
  onDescriptionChanged?: (value: string) => void;
  onQuantityChanged?: (value: number) => void;
}) {
  const completed = completedQuantity >= computedQuantity;

  const mainOnChecked = (checked: boolean) => {
    if (checked) {
      onCompletionChanged(completedQuantity + 1);
    } else {
      onCompletionChanged(0);
    }
  };

  const {
    ref,
    state,
    props: holdProps,
  } = useLongPress({
    onActivate() {},
    onDurationReached: () => {
      onCompletionChanged(computedQuantity);
    },
    // effectively disable, until supported...
    delay: completed ? 60 * 1000 : 400,
    duration: 1000,
  });

  const canEdit = onDescriptionChanged || onQuantityChanged;
  const [editing, setEditing] = useState(canEdit && !description);

  const particles = useParticles();
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (completed && barRef.current) {
      particles?.elementExplosion({
        count: 40,
        element: barRef.current,
        color: {
          opacity: 1,
          space: 'rgb',
          values: [115, 219, 160],
        },
      });
    }
  }, [completed, particles]);

  return (
    <div className="w-full p-2 flex flex-col gap-2">
      <div className="w-full flex flex-row items-center gap-2">
        <Popover open={state === 'holding' || state === 'candidate'}>
          <PopoverAnchor asChild>
            <CheckboxRoot
              checked={completed}
              onCheckedChange={mainOnChecked}
              className="w-32px h-32px rounded-full touch-none flex items-center justify-center"
              ref={ref}
              {...holdProps}
            >
              <Icon name={completed ? 'check' : 'plus'} />
            </CheckboxRoot>
          </PopoverAnchor>
          <PopoverContent>
            <PopoverArrow />
            <div className="absolute z--1 top-0 left-0 h-full bg-accent-wash animate-progress-bar animate-duration-[1s] animate-delay-[400ms] animate-forwards" />
            <div className="flex flex-row">
              Hold to complete
              <Icon
                className={classNames(
                  'ml-2',
                  state === 'candidate' ? 'opacity-100' : 'opacity-50',
                )}
                name="check"
              />
            </div>
          </PopoverContent>
        </Popover>
        {onDescriptionChanged && editing ? (
          <LiveUpdateTextField
            value={description}
            onChange={onDescriptionChanged}
          />
        ) : (
          <label>{description}</label>
        )}
        {onQuantityChanged && editing ? (
          <NumberStepper
            value={computedQuantity}
            onChange={onQuantityChanged}
          />
        ) : (
          <span className="text-gray-7">×{computedQuantity}</span>
        )}
        {canEdit && (
          <Button
            size="icon"
            color="ghost"
            onClick={() => setEditing((v) => !v)}
          >
            <Icon name={editing ? 'check' : 'pencil'} />
          </Button>
        )}
      </div>
      <Progress.Root
        value={completedQuantity / computedQuantity}
        className="relative overflow-hidden rounded-full w-full h-12px border border-solid border-black"
        style={{
          // Fix overflow clipping in Safari
          // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
          transform: 'translateZ(0)',
        }}
        ref={barRef}
      >
        <Progress.Indicator
          className="bg-accent w-full h-full transition-transform duration-[300ms] ease-out"
          style={{
            transform: `translateX(-${
              100 * (1 - completedQuantity / computedQuantity)
            }%)`,
          }}
        />
        {new Array(computedQuantity - 1).fill(0).map((_, i) => (
          <div
            key={i}
            className="w-1px h-full bg-gray-4 absolute top-0 left-0"
            style={{
              left: `${(100 / computedQuantity) * (i + 1)}%`,
            }}
          />
        ))}
      </Progress.Root>
    </div>
  );
}
