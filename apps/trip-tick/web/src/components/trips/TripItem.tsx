import {
  getComputedQuantity,
  quantityForecast,
} from '@/components/trips/utils.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { CheckboxRoot } from '@a-type/ui/components/checkbox';
import { Icon } from '@a-type/ui/components/icon';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import { useParticles } from '@a-type/ui/components/particles';
import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
} from '@a-type/ui/components/popover';
import { useLongPress } from '@a-type/ui/hooks';
import { FragmentOf, ResultOf } from '@biscuits/client';
import * as Progress from '@radix-ui/react-progress';
import {
  ListItemsItem,
  TripCompletionsValue,
  TripExtraItemsValueItem,
} from '@trip-tick.biscuits/verdant';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { getItemRulesLabel } from '../lists/utils.js';

export function ListItem({
  item,
  days,
  completion,
  onCompletionChanged,
  forecast,
  hotThreshold,
  coldThreshold,
}: {
  item: ListItemsItem;
  days: number;
  completion: TripCompletionsValue;
  onCompletionChanged: (completion: TripCompletionsValue) => void;
  forecast?: ResultOf<typeof quantityForecast>;
  hotThreshold?: number;
  coldThreshold?: number;
}) {
  const {
    description,
    periodMultiplier,
    condition,
    quantity,
    additional,
    roundDown,
    period,
  } = hooks.useWatch(item);
  const computedQuantity = getComputedQuantity({
    periodMultiplier,
    quantity,
    days,
    additional,
    roundDown,
    condition,
    weather: forecast,
    period,
    hotThreshold,
    coldThreshold,
  });

  if (computedQuantity === 0) {
    return null;
  }

  return (
    <ChecklistItem
      description={description}
      completedQuantity={completion}
      computedQuantity={computedQuantity}
      onCompletionChanged={onCompletionChanged}
      subline={getItemRulesLabel(item)}
    />
  );
}

export function ExtraItem({
  item,
  completion,
  onCompletionChanged,
  onDelete,
}: {
  item: TripExtraItemsValueItem;
  completion: TripCompletionsValue;
  onCompletionChanged: (completion: TripCompletionsValue) => void;
  onDelete: () => void;
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
      onDelete={onDelete}
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
  subline,
  onDelete,
}: {
  computedQuantity: number;
  completedQuantity: number;
  onCompletionChanged: (value: number) => void;
  description: string;
  onDescriptionChanged?: (value: string) => void;
  onQuantityChanged?: (value: number) => void;
  onDelete?: () => void;
  subline?: string;
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
      <div className="w-full flex flex-row items-center gap-2 flex-wrap">
        <Popover open={state === 'holding' || state === 'candidate'}>
          <PopoverAnchor asChild>
            <CheckboxRoot
              checked={completed}
              onCheckedChange={mainOnChecked}
              className="w-32px h-32px rounded-full touch-none flex items-center justify-center text-black"
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
            placeholder="What is it?"
            className="flex-1 min-w-50%"
          />
        ) : (
          <label className="font-bold select-none">{description}</label>
        )}
        {!!onQuantityChanged && editing && (
          <NumberStepper
            value={computedQuantity}
            onChange={onQuantityChanged}
            className="mr-auto"
          />
        )}
        {editing && onDelete && (
          <Button size="icon" color="ghostDestructive" onClick={onDelete}>
            <Icon name="x" />
          </Button>
        )}
        {canEdit && (
          <Button
            size="icon"
            color={editing ? 'default' : 'ghost'}
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
            className="w-1px h-full bg-gray-6 absolute top-0 left-0"
            style={{
              left: `${(100 / computedQuantity) * (i + 1)}%`,
            }}
          />
        ))}
      </Progress.Root>
      <div className="flex flex-row justify-between gap-2 items-center text-xs text-gray-7">
        {subline && <div className="italic">{subline}</div>}
        <span className="ml-auto">
          {completedQuantity} / {computedQuantity}
        </span>
      </div>
    </div>
  );
}
