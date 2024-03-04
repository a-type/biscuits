import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Trip } from '@packing-list/verdant';
import { Link } from '@verdant-web/react-router';
import classNames from 'classnames';

export interface AddListsPickerProps {
  trip: Trip;
  className?: string;
}

export function AddListsPicker({ trip, className }: AddListsPickerProps) {
  const lists = hooks.useAllLists();

  const tripLists = hooks.useWatch(trip.get('lists'));

  return (
    <div
      className={classNames(
        'flex flex-row items-center flex-wrap gap-2',
        className,
      )}
    >
      {lists.map((list) => {
        const id = list.get('id');
        const active = tripLists.includes(id);
        return (
          <Button
            key={id}
            size="small"
            color={active ? 'primary' : 'default'}
            onClick={() => {
              if (active) {
                trip.get('lists').removeAll(list.get('id'));
              } else {
                trip.get('lists').add(list.get('id'));
              }
            }}
          >
            <div
              className={
                active
                  ? `i-solar-check-circle-linear`
                  : `i-solar-add-circle-linear`
              }
            />
            {list.get('name')}
          </Button>
        );
      })}
      {!lists.length && (
        <div className="italic text-gray-7">
          You have no lists yet.{' '}
          <Link to="/lists" className="text-primary-dark">
            Create one
          </Link>
          ?
        </div>
      )}
    </div>
  );
}
