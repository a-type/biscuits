import { AddListsPicker } from '@/components/trips/AddListsPicker.jsx';
import { useTripDays, useTripProgress } from '@/components/trips/hooks.js';
import { getComputedQuantity } from '@/components/trips/utils.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Checkbox } from '@a-type/ui/components/checkbox';
import { CollapsibleSimple } from '@a-type/ui/components/collapsible';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@a-type/ui/components/tabs';
import { H2, H4 } from '@a-type/ui/components/typography';
import {
  List,
  ListItemsItem,
  Trip,
  TripCompletions,
  TripCompletionsValue,
} from '@packing-list/verdant';
import * as Progress from '@radix-ui/react-progress';
import { useNavigate, useSearchParams } from '@verdant-web/react-router';
import { useState } from 'react';
import { TripDateRange } from './TripDateRange.jsx';
import classNames from 'classnames';
import { toast } from 'react-hot-toast';
import { Icon } from '@a-type/ui/components/icon';

export interface TripViewProps {
  tripId: string;
}

export function TripView({ tripId }: TripViewProps) {
  const trip = hooks.useTrip(tripId);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <TripViewInfo trip={trip} />
      <TripViewChecklists trip={trip} />
      <ManageTrip trip={trip} />
    </div>
  );
}

function TripViewInfo({ trip }: { trip: Trip }) {
  const { name, startsAt, endsAt } = hooks.useWatch(trip);
  return (
    <div
      className={classNames('flex flex-col items-start transition', {
        'gap-10': !startsAt || !endsAt,
        'gap-1': startsAt && endsAt,
      })}
    >
      <LiveUpdateTextField
        value={name}
        onChange={(v) => trip.set('name', v)}
        className="text-xl w-full"
      />
      <TripDateRange trip={trip} />
    </div>
  );
}

function TripViewChecklists({ trip }: { trip: Trip }) {
  const { lists, completions } = hooks.useWatch(trip);
  const days = useTripDays(trip);
  hooks.useWatch(lists);
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
      <div className="w-full flex-1 flex flex-col items-center justify-center text-gray-7">
        <div>Select dates to get started</div>
      </div>
    );
  }

  return (
    <div>
      <TabsRoot
        value={activeList}
        onValueChange={(val) => {
          setParams((params) => {
            params.set('list', val);
            return params;
          });
        }}
      >
        <div className="flex flex-row gap-2 items-start">
          <div className="flex-1">
            <CollapsibleSimple open={editingLists}>
              <H4 className="mx-1 my-2">
                {startedWithNoLists ? 'Add lists' : 'Edit lists'}
              </H4>
              <AddListsPicker trip={trip} className="p-2" />
            </CollapsibleSimple>
            <CollapsibleSimple open={!editingLists}>
              <TabsList className="important:justify-start">
                {mappedLists.map((list) => (
                  <ListTab list={list} key={list.get('id')} trip={trip} />
                ))}
              </TabsList>
            </CollapsibleSimple>
          </div>
          <Button
            className="flex-0-0-auto m-1 relative top-2"
            size="icon"
            color={editingLists ? 'accent' : 'ghost'}
            onClick={() => setEditingLists((v) => !v)}
          >
            {editingLists ? (
              <div className="i-solar-check-circle-linear" />
            ) : (
              <div className="i-solar-settings-linear" />
            )}
          </Button>
        </div>
        {mappedLists.map((list) => (
          <TabsContent key={list.get('id')} value={list.get('id')}>
            <TripViewChecklist
              key={list.get('id')}
              list={list}
              days={days}
              completions={completions}
            />
          </TabsContent>
        ))}
      </TabsRoot>
    </div>
  );
}

function ListTab({ trip, list }: { list: List; trip: Trip }) {
  const { value } = useTripProgress(trip, { listFilter: [list.get('id')] });
  return (
    <TabsTrigger
      value={list.get('id')}
      className="relative overflow-hidden !border-gray-7"
    >
      <span>{list.get('name')}</span>
      <Progress.Root className="w-full absolute bottom-0 left-0 overflow-hidden rounded-b-full border border-t-solid border-t-gray-4">
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
}: {
  list: List;
  days: number;
  completions: TripCompletions;
}) {
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);
  hooks.useWatch(completions);

  return (
    <ul className="list-none flex flex-col gap-3 m-0 p-0">
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
    </ul>
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
  const completedQuantity = completion;
  const computedQuantity = getComputedQuantity({
    perDays,
    quantity,
    days,
    additional,
    roundDown,
  });
  const completed = completedQuantity >= computedQuantity;

  const mainOnChecked = (checked: boolean) => {
    if (checked) {
      onCompletionChanged(completedQuantity + 1);
    } else {
      onCompletionChanged(0);
    }
  };
  const subOnChecked = (checked: boolean) => {
    if (checked) {
      onCompletionChanged(completedQuantity + 1);
    } else {
      onCompletionChanged(completedQuantity - 1);
    }
  };

  return (
    <div className="w-full p-2 flex flex-col gap-2">
      <div className="w-full flex flex-row items-center gap-2">
        <Checkbox
          checked={completed}
          onCheckedChange={mainOnChecked}
          className="w-32px h-32px rounded-full"
        />
        <label>{description}</label>
        <span className="text-gray-7">×{computedQuantity}</span>
      </div>
      <Progress.Root
        value={completedQuantity / computedQuantity}
        className="relative overflow-hidden rounded-full w-full h-12px border border-solid border-gray-4"
        style={{
          // Fix overflow clipping in Safari
          // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
          transform: 'translateZ(0)',
        }}
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

function ManageTrip({ trip }: { trip: Trip }) {
  const client = hooks.useClient();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3">
      <H2>Manage trip</H2>
      <div className="flex flex-row gap-2">
        <Button
          color="destructive"
          onClick={() => {
            client.trips.delete(trip.get('id'));
            navigate('/trips', { skipTransition: true });
            toast((t) => (
              <span className="flex gap-2 items-center">
                <Icon name="check" />
                <span>Trip deleted!</span>
                <Button
                  size="small"
                  onClick={() => {
                    client.undoHistory.undo();
                    toast.dismiss(t.id);
                  }}
                >
                  Undo
                </Button>
              </span>
            ));
          }}
        >
          Delete trip
        </Button>
      </div>
    </div>
  );
}
