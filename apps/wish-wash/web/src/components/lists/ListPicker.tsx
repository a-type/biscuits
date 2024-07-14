import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import { HorizontalList } from '@a-type/ui/components/horizontalList';
import { assert } from '@a-type/utils';
import { useCanSync, useLocalStorage } from '@biscuits/client';
import { authorization, List } from '@wish-wash.biscuits/verdant';
import { Button } from '@a-type/ui/components/button';
import { Link } from '@verdant-web/react-router';
import { CreateListButton } from './CreateListButton.jsx';
import { useEffect, useRef, useState } from 'react';
import { clsx } from '@a-type/ui';

export interface ListPickerProps {
  className?: string;
  value: string;
}

export function ListPicker({ className, value, ...props }: ListPickerProps) {
  const [open, setOpen] = useLocalStorage('list-picker-open', false);
  return (
    <div {...props} className={clsx('relative w-full mb-4', className)}>
      <HorizontalList
        className="w-full min-w-0 rounded-lg"
        open={open}
        onOpenChange={setOpen}
      >
        <ListsPickerLists value={value} />
        <CreateListButton
          size="icon"
          color="default"
          // className="sticky right-2 bottom-2 ml-auto"
        >
          <Icon name="plus" />
        </CreateListButton>
      </HorizontalList>
    </div>
  );
}

function ListsPickerLists({ value }: { value: string }) {
  const lists = hooks.useAllLists();

  // sort by recently created, with current value first
  const sorted = lists.sort((a, b) => a.get('createdAt') - b.get('createdAt'));

  return (
    <>
      {sorted.map((list) => (
        <ListPickerListButton
          selected={value === list.get('id')}
          list={list}
          key={list.uid}
        />
      ))}
    </>
  );
}

function ListPickerListButton({
  list,
  selected,
}: {
  list: List;
  selected: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'center',
      });
    }
  }, [selected]);

  return (
    <Button
      size="small"
      color={selected ? 'accent' : 'ghost'}
      asChild
      // className={clsx(selected && 'sticky left-2 right-12 z-1')}
      ref={ref}
    >
      <Link to={`/${list.get('id')}`}>
        <Icon name={list.isAuthorized ? 'lock' : 'add_person'} />{' '}
        {list.get('name')}
      </Link>
    </Button>
  );
}
