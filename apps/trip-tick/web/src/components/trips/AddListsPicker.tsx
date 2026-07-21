import { hooks } from '@/store.js';
import { Box, Button, Icon, Text } from '@a-type/ui';
import { Trip } from '@trip-tick.biscuits/verdant';
import { AddListButton } from '../lists/AddListButton.jsx';

export interface AddListsPickerProps {
	trip: Trip;
	className?: string;
}

export function AddListsPicker({ trip, className }: AddListsPickerProps) {
	const lists = hooks.useAllLists();

	const tripLists = hooks.useWatch(trip.get('lists'));

	return (
		<Box full="width" wrap items="center" gap="sm" className={className}>
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
						style={{
							borderRadius: 'var(--m-rd)',
						}}
					>
						<Icon name={active ? 'check' : 'plus'} />
						<Box col gap="xs">
							<Text>{list.get('name')}</Text>
							<Text emphasis="ambient" dim>
								{list.get('items').length} items
							</Text>
						</Box>
					</Button>
				);
			})}
			{!lists.length && (
				<Text italic dim>
					You have no lists yet.{' '}
					<AddListButton emphasis="light" size="small">
						Create one
					</AddListButton>
					?
				</Text>
			)}
		</Box>
	);
}
