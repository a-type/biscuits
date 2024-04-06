import { hooks } from '@/store.js';
import { Button } from '@a-type/ui/components/button';
import { Trip } from '@trip-tick.biscuits/verdant';
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
            color={active ? 'primary' : 'default'}
            onClick={() => {
              if (active) {
                trip.get('lists').removeAll(list.get('id'));
              } else {
                trip.get('lists').add(list.get('id'));
              }
            }}
            className="rounded-md gap-4 py-4"
          >
            <div
              className={
                active
                  ? `i-solar-check-circle-linear`
                  : `i-solar-add-circle-linear`
              }
            />
            <div className="flex flex-col gap-1 text-start">
              <span>{list.get('name')}</span>
              <span className="text-sm text-gray-7">
                {list.get('items').length} items
              </span>
            </div>
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
