import { List, ListItemsItem } from '@trip-tick.biscuits/verdant';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { Button } from '@a-type/ui/components/button';
import { hooks } from '@/store.js';
import { NumberStepper } from '@a-type/ui/components/numberStepper';
import {
  ToggleGroup,
  ToggleItem,
  ToggleItemDescription,
  ToggleItemIndicator,
  ToggleItemLabel,
  ToggleItemTitle,
} from '@/components/ui/ToggleGroup.jsx';
import { withClassName } from '@a-type/ui/hooks';
import { forwardRef, useState } from 'react';
import {
  CollapsibleSimple,
  CollapsibleTrigger,
} from '@a-type/ui/components/collapsible';
import { Icon } from '@a-type/ui/components/icon';
import { H2 } from '@a-type/ui/components/typography';
import { OnboardingTooltip } from '@biscuits/client';
import { firstList } from '@/onboarding/firstList.js';
import { Link } from '@verdant-web/react-router';

export interface ListEditorProps {
  list: List;
}

export function ListEditor({ list }: ListEditorProps) {
  const { name } = hooks.useWatch(list);
  const [editName, setEditName] = useState(!name || name === 'New List');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-1 items-center">
        <Button asChild color="ghost" size="icon">
          <Link to="/lists">
            <Icon name="arrowLeft" />
            <span className="sr-only">Back to lists</span>
          </Link>
        </Button>
        {editName ? (
          <LiveUpdateTextField
            value={name}
            onChange={(v) => list.set('name', v)}
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
      <ListItemsEditor list={list} />
    </div>
  );
}

function ListItemsEditor({ list }: { list: List }) {
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);

  return (
    <div>
      <H2 className="mb-4">Items</H2>
      <ul className="mb-2 mt-0 list-none mx-0 px-0 flex flex-col gap-3 md:flex-1">
        {items.map((item) => (
          <li key={item.get('id')}>
            <ListItemEditor
              item={item}
              onDelete={() => {
                items.removeAll(item);
              }}
            />
          </li>
        ))}
        <li className="self-center justify-self-center">
          <OnboardingTooltip
            onboarding={firstList}
            step="addItem"
            content="Add your first item you want to pack"
          >
            <AddListItemButton list={list} />
          </OnboardingTooltip>
        </li>
      </ul>
    </div>
  );
}

function ListItemEditor({
  item,
  onDelete,
}: {
  item: ListItemsItem;
  onDelete: () => void;
}) {
  const { description, quantity, additional, perDays, roundDown } =
    hooks.useWatch(item);

  const [expanded, setExpanded] = useState(false);

  let shortString = `${quantity} per `;
  if (perDays) {
    shortString += `${perDays} days`;
  } else {
    shortString += 'trip';
  }
  if (additional) {
    shortString += ` + ${additional}`;
  }

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
        <div className="flex flex-col gap-3 items-start p-1">
          <FieldGroup>
            <FieldLabel>Pack</FieldLabel>
            <FieldArea>
              <NumberStepper
                increment={1}
                value={quantity}
                onChange={(v) => {
                  if (v > 0) item.set('quantity', v);
                }}
              />
            </FieldArea>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>for every</FieldLabel>
            <FieldArea>
              {perDays > 0 ? (
                <div className="flex flex-row gap-1 items-center">
                  <NumberStepper
                    value={perDays}
                    increment={1}
                    onChange={(v) => {
                      if (v >= 0) item.set('perDays', v);
                    }}
                  />
                  <span>day{perDays === 1 ? '' : 's'}</span>
                </div>
              ) : (
                <div className="flex flex-row gap-1 justify-between items-center border border-black rounded-full border-solid pl-6 pr-1 h-[33px] w-[178px]">
                  <div className="w-[30px]" />
                  <span>trip</span>
                  <Button
                    size="small"
                    color="ghost"
                    className="h-full"
                    onClick={() => item.set('perDays', 1)}
                  >
                    <Icon name="plus" className="w-[12px] h-[12px] flex" />
                  </Button>
                </div>
              )}
            </FieldArea>
          </FieldGroup>
          {additional > 0 ? (
            <div className="flex flex-row gap-1 items-center">
              <span>Plus</span>
              <NumberStepper
                value={additional}
                onChange={(v) => {
                  if (v < 0) return;
                  item.set('additional', v);
                }}
              />
              <span>extra per trip</span>
            </div>
          ) : (
            <div>
              <Button
                size="small"
                color="default"
                onClick={() => item.set('additional', 1)}
              >
                <Icon name="plus" />
                Add extra
              </Button>
            </div>
          )}
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

const AddListItemButton = forwardRef<HTMLButtonElement, { list: List }>(
  function AddListItemButton({ list }, ref) {
    const { items } = hooks.useWatch(list);

    return (
      <Button
        color="default"
        className="w-full items-center justify-center"
        onClick={() =>
          items.push({
            description: 'New item',
          })
        }
        ref={ref}
      >
        Add Item
      </Button>
    );
  },
);

const FieldGroup = withClassName(
  'div',
  'flex flex-col gap-2 items-start w-full',
);
const FieldLabel = withClassName('label', 'text-sm font-medium');
const FieldArea = withClassName(
  'div',
  'flex flex-col gap-2 items-start w-full',
);
