import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import { HorizontalList } from '@a-type/ui/components/horizontalList';
import { assert } from '@a-type/utils';
import { useCanSync } from '@biscuits/client';
import { authorization } from '@wish-wash.biscuits/verdant';
import { Button } from '@a-type/ui/components/button';
import { Link } from '@verdant-web/react-router';
import { CreateListButton } from './CreateListButton.jsx';
import { useState } from 'react';
import { clsx } from '@a-type/ui';

export interface ListPickerProps {
  className?: string;
  value: string;
}

export function ListPicker({ className, value, ...props }: ListPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div {...props} className={clsx('relative w-full mb-4', className)}>
      <HorizontalList open={open} className="w-full min-w-0">
        <ListsPickerLists value={value} />
        <CreateListButton
          size="icon"
          color="primary"
          // className="sticky right-2 bottom-2"
        >
          <Icon name="plus" />
        </CreateListButton>
      </HorizontalList>
      <Button
        size="icon"
        className="absolute top-100% -translate-y-1/4 right-2"
        toggled={open}
        toggleMode="state-only"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon
          name="chevron"
          className={clsx('transition-transform', open && 'rotate-180')}
        />
      </Button>
    </div>
  );
}

function ListsPickerLists({ value }: { value: string }) {
  const lists = hooks.useAllLists();

  // sort by recently created, with current value first
  const sorted = lists.sort((a, b) =>
    a.get('id') === value
      ? -1
      : b.get('id') === value
        ? 1
        : a.get('createdAt') - b.get('createdAt'),
  );

  return (
    <>
      {sorted.map((list) => (
        <Button
          size="small"
          key={list.uid}
          color={value === list.get('id') ? 'default' : 'ghost'}
          asChild
          className={clsx(
            value === list.get('id') && 'sticky left-2 right-12 z-1',
          )}
        >
          <Link to={`/${list.get('id')}`}>
            <Icon name={list.isAuthorized ? 'lock' : 'add_person'} />{' '}
            {list.get('name')}
          </Link>
        </Button>
      ))}
    </>
  );
}
