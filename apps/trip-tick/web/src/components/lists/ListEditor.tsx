import { List, ListItemsItem } from '@packing-list/verdant';
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
import { useState } from 'react';
import {
  CollapsibleSimple,
  CollapsibleTrigger,
} from '@a-type/ui/components/collapsible';
import { Icon } from '@a-type/ui/components/icon';

export interface ListEditorProps {
  list: List;
}

export function ListEditor({ list }: ListEditorProps) {
  const { name } = hooks.useWatch(list);

  return (
    <div className="flex flex-col gap-3 md:(flex-row items-start)">
      <LiveUpdateTextField
        value={name}
        onChange={(name) => list.set('name', name)}
        className="h-auto"
      />
      <ListItemsEditor list={list} />
    </div>
  );
}

function ListItemsEditor({ list }: { list: List }) {
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);

  return (
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
        <AddListItemButton list={list} />
      </li>
    </ul>
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

  let shortString = `${quantity} / `;
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
        <div className="flex flex-col gap-1">
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
                <div className="flex flex-row gap-1 items-center border border-gray-7 rounded-lg border-solid px-6">
                  <span>trip</span>
                  <Button
                    size="icon"
                    color="ghost"
                    onClick={() => item.set('perDays', 1)}
                  >
                    +
                  </Button>
                </div>
              )}
            </FieldArea>
          </FieldGroup>
        </div>
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
            <ToggleItemIndicator>☑️</ToggleItemIndicator>
            <ToggleItemLabel>
              <ToggleItemTitle>Pack light</ToggleItemTitle>
              <ToggleItemDescription>
                Rounds the number of items down
              </ToggleItemDescription>
            </ToggleItemLabel>
          </ToggleItem>
          <ToggleItem value="up">
            <ToggleItemIndicator>☑️</ToggleItemIndicator>
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
      </CollapsibleSimple>
      <CollapsibleSimple open={!expanded} onOpenChange={(v) => setExpanded(!v)}>
        <CollapsibleTrigger asChild>
          <Button size="small" color="ghost">
            <Icon name="convert" />
            <span>{shortString}</span>
          </Button>
        </CollapsibleTrigger>
      </CollapsibleSimple>
    </div>
  );
}

function AddListItemButton({ list }: { list: List }) {
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
    >
      Add Item
    </Button>
  );
}

const FieldGroup = withClassName(
  'div',
  'flex flex-col gap-2 items-start w-full',
);
const FieldLabel = withClassName('label', 'text-sm font-medium');
const FieldArea = withClassName(
  'div',
  'flex flex-col gap-2 items-start w-full',
);
