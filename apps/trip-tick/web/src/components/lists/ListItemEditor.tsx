import {
  ToggleGroup,
  ToggleItem,
  ToggleItemDescription,
  ToggleItemIndicator,
  ToggleItemLabel,
  ToggleItemTitle,
} from '@/components/ui/ToggleGroup.jsx';
import { firstList } from '@/onboarding/firstList.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import {
  CollapsibleSimple,
  CollapsibleTrigger,
} from '@a-type/ui/components/collapsible';
import { Icon } from '@a-type/ui/components/icon';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectIcon,
} from '@a-type/ui/components/select';
import { withClassName } from '@a-type/ui/hooks';
import { OnboardingTooltip, useCanSync } from '@biscuits/client';
import {
  ListItemsItem,
  ListItemsItemCondition,
  ListItemsItemPeriod,
} from '@trip-tick.biscuits/verdant';
import { useState } from 'react';
import pluralize from 'pluralize';
import { conditionNames, getItemRulesLabel, periodNames } from './utils.js';

export function ListItemEditor({
  item,
  onDelete,
}: {
  item: ListItemsItem;
  onDelete: () => void;
}) {
  const {
    description,
    quantity,
    additional,
    condition,
    periodMultiplier,
    period,
    roundDown,
  } = hooks.useWatch(item);

  const [expanded, setExpanded] = useState(false);

  const shortString = getItemRulesLabel(item);

  const isSubscribed = useCanSync();

  return (
    <div className="flex flex-col gap-3 border border-solid border-gray-5 p-2 rounded-lg w-full">
      <div className="flex flex-row justify-between items-center">
        <LiveUpdateTextField
          value={description}
          onChange={(v) => item.set('description', v)}
          className="flex-1"
        />
        <Button size="icon" color="ghostDestructive" onClick={onDelete}>
          <div className="i-solar-trash-bin-minimalistic-linear" />
        </Button>
      </div>
      <CollapsibleSimple open={expanded} onOpenChange={setExpanded}>
        <div className="grid grid-cols-2 gap-3 items-start p-1">
          <FieldGroup>
            <FieldLabel className="font-bold">Pack</FieldLabel>
            <FieldArea>
              <NumberStepper
                increment={1}
                value={quantity}
                onChange={(v) => {
                  if (v > 0) item.set('quantity', v);
                }}
                className="bg-white"
              />
            </FieldArea>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel className="font-bold">for every</FieldLabel>
            <FieldArea>
              <NumberStepper
                value={periodMultiplier}
                increment={1}
                onChange={(v) => {
                  if (v >= 0) item.set('periodMultiplier', v);
                }}
                className="bg-white"
                disabled={period === 'trip'}
              />
              <Select
                value={period}
                onValueChange={(v) => {
                  item.set('period', v);
                  if (v === 'trip') {
                    item.set('periodMultiplier', 1);
                  }
                }}
              >
                <SelectTrigger className="w-full bg-white justify-between border-default py-1.5 px-4">
                  <SelectValue />
                  <SelectIcon />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(periodNames).map(([key, value]) => (
                    <SelectItem value={key} key={key}>
                      {pluralize(value, periodMultiplier)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldArea>
          </FieldGroup>
          {isSubscribed && (
            <FieldGroup>
              <FieldLabel>
                {period === 'trip' ? "with a day that's" : 'which is'}
              </FieldLabel>
              <FieldArea>
                <Select
                  value={condition ?? ('null' as const)}
                  onValueChange={(v) => {
                    if (v === 'null') item.set('condition', null);
                    else item.set('condition', v);
                  }}
                >
                  <SelectTrigger className="w-full bg-white justify-between border-default py-1.5 px-4">
                    <SelectValue />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">add condition...</SelectItem>
                    {Object.entries(conditionNames).map(([key, value]) => (
                      <SelectItem value={key} key={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldArea>
            </FieldGroup>
          )}
          <FieldGroup>
            <FieldLabel>plus</FieldLabel>
            <FieldArea>
              <div className="flex flex-row gap-2 items-center">
                <NumberStepper
                  value={additional}
                  onChange={(v) => {
                    if (v < 0) return;
                    item.set('additional', v);
                  }}
                  className="bg-white"
                  renderValue={(d) => (d === 0 ? 'None' : `${d} / trip`)}
                />
              </div>
            </FieldArea>
          </FieldGroup>
        </div>
        <div className="flex flex-col gap-3 items-start p-1">
          {periodMultiplier > 1 && (
            <ToggleGroup
              value={roundDown ? 'down' : 'up'}
              type="single"
              onValueChange={(v) => {
                item.set('roundDown', v === 'down');
              }}
            >
              <ToggleItem value="down">
                <ToggleItemIndicator>
                  <Icon name="check" />
                </ToggleItemIndicator>
                <ToggleItemLabel>
                  <ToggleItemTitle>Pack light</ToggleItemTitle>
                  <ToggleItemDescription>
                    Rounds the number of items down
                  </ToggleItemDescription>
                </ToggleItemLabel>
              </ToggleItem>
              <ToggleItem value="up">
                <ToggleItemIndicator>
                  <Icon name="check" />
                </ToggleItemIndicator>
                <ToggleItemLabel>
                  <ToggleItemTitle>Pack safe</ToggleItemTitle>
                  <ToggleItemDescription>
                    Rounds the number of items up
                  </ToggleItemDescription>
                </ToggleItemLabel>
              </ToggleItem>
            </ToggleGroup>
          )}
          <CollapsibleTrigger asChild>
            <Button size="small" color="default">
              Done
            </Button>
          </CollapsibleTrigger>
        </div>
      </CollapsibleSimple>
      <CollapsibleSimple open={!expanded} onOpenChange={(v) => setExpanded(!v)}>
        <OnboardingTooltip
          onboarding={firstList}
          step="conditions"
          content="Set rules for how many of this item you want to pack for each trip"
        >
          <CollapsibleTrigger asChild>
            <Button size="small" color="ghost" className="text-black">
              <Icon name="pencil" />
              <span>{shortString}</span>
            </Button>
          </CollapsibleTrigger>
        </OnboardingTooltip>
      </CollapsibleSimple>
    </div>
  );
}

const FieldGroup = withClassName('div', 'flex flex-col gap-2 items-start');
const FieldLabel = withClassName('label', 'text-sm font-medium font-bold');
const FieldArea = withClassName(
  'div',
  'flex flex-col gap-2 items-start w-full',
);
