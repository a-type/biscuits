import { firstList } from '@/onboarding/firstList.js';
import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';
import { LiveUpdateTextField } from '@a-type/ui/components/liveUpdateTextField';
import { H2 } from '@a-type/ui/components/typography';
import { debounce } from '@a-type/utils';
import { OnboardingTooltip } from '@biscuits/client';
import { List } from '@trip-tick.biscuits/verdant';
import { forwardRef, useState } from 'react';
import { toast } from '@a-type/ui';
import { AddSuggested } from './AddSuggested.jsx';
import { ListInfoEditor } from './ListInfoEditor.jsx';
import { ListItemEditor } from './ListItemEditor.jsx';

export interface ListEditorProps {
  list: List;
}

export function ListEditor({ list }: ListEditorProps) {
  const { name } = hooks.useWatch(list);
  const [editName, setEditName] = useState(!name || name === 'New List');

  hooks.useOnChange(
    list,
    (info) => {
      if (info.isLocal) showSaveToast();
    },
    { deep: true },
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row gap-1 items-center">
        {editName ? (
          <LiveUpdateTextField
            value={name}
            onChange={(v) => list.set('name', v)}
            className="text-xl w-full"
            autoFocus={editName}
            onBlur={() => setEditName(false)}
            autoSelect
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
      <ListInfoEditor list={list} />
      <ListItemsEditor list={list} />
    </div>
  );
}

const showSaveToast = debounce(() => {
  toast.success('Changes saved', {
    id: 'saved',
    duration: 2000,
  });
}, 1000);

function ListItemsEditor({ list }: { list: List }) {
  const { items } = hooks.useWatch(list);
  hooks.useWatch(items);

  return (
    <div className="flex flex-col gap-4">
      <H2>Items</H2>
      <ul className="mt-0 list-none mx-0 px-0 flex flex-col gap-3 md:flex-1">
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
        <li className="self-start justify-self-start">
          <OnboardingTooltip
            onboarding={firstList}
            step="addItem"
            content="Add your first item you want to pack"
          >
            <AddListItemButton list={list} />
          </OnboardingTooltip>
        </li>
      </ul>
      <AddSuggested items={items} />
    </div>
  );
}

const AddListItemButton = forwardRef<HTMLButtonElement, { list: List }>(
  function AddListItemButton({ list }, ref) {
    const { items } = hooks.useWatch(list);

    return (
      <Button
        color="primary"
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
