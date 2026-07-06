import { hooks } from '@/store.js';
import { Box, Button, H2, Icon, P } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { AddListButton } from './AddListButton.jsx';

export interface ListsListProps {}

export function ListsList({}: ListsListProps) {
	const lists = hooks.useAllLists();

	if (lists.length === 0) {
		return (
			<Box col items="start" gap>
				<H2>Welcome!</H2>
				<P>
					Trip Tick is a list-making app purpose-made for planning what to pack
					for your next trip.
				</P>
				<P>To get started, you need to create your first packing list.</P>
				<AddListButton />
			</Box>
		);
	}

	return (
		<Box col items="start" gap>
			<H2>Lists</H2>
			<Box wrap gap="sm" style={{ maxHeight: 80 }}>
				{lists.map((list) => (
					<Button
						size="small"
						key={list.get('id')}
						render={<Link to={`/lists/${list.get('id')}`} />}
					>
						{list.get('name')}
					</Button>
				))}
				<AddListButton size="small">
					<Icon name="plus" />
					New List
				</AddListButton>
			</Box>
		</Box>
	);
}
