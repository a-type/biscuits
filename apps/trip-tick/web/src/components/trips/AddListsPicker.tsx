import { hooks } from '@/store.js';
import { Button, Icon } from '@a-type/ui';
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
				'flex flex-row items-center flex-wrap gap-2 w-full',
				className,
			)}
		>
			{lists.map((list) => {
				const id = list.get('id');
				const active = tripLists.includes(id);
				return (
					<Button
						key={id}
						emphasis={active ? 'primary' : 'default'}
						onClick={() => {
							if (active) {
								trip.get('lists').removeAll(list.get('id'));
							} else {
								trip.get('lists').add(list.get('id'));
							}
						}}
						className="rounded-md gap-4 py-4"
					>
						<Icon name={active ? 'check' : 'plus'} />
						<div className="flex flex-col gap-1 text-start">
							<span>{list.get('name')}</span>
							<span className="text-sm color-gray-dark">
								{list.get('items').length} items
							</span>
						</div>
					</Button>
				);
			})}
			{!lists.length && (
				<div className="italic color-gray-dark">
					You have no lists yet.{' '}
					<Link to="/lists" className="color-primary-dark">
						Create one
					</Link>
					?
				</div>
			)}
		</div>
	);
}
