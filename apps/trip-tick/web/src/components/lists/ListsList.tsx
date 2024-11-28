import { hooks } from '@/store.js';
import { Button, H2, Icon, P } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { AddListButton } from './AddListButton.jsx';

export interface ListsListProps {}

export function ListsList({}: ListsListProps) {
	const lists = hooks.useAllLists();

	if (lists.length === 0) {
		return (
			<div className="flex flex-col gap-4 items-start">
				<H2>Welcome!</H2>
				<P>
					Trip Tick is a list-making app purpose-made for planning what to pack
					for your next trip.
				</P>
				<P>To get started, you need to create your first packing list.</P>
				<AddListButton />
			</div>
		);
	}

	return (
		<div className="col items-start">
			<H2>Lists</H2>
			<div className="flex flex-row flex-wrap gap-2 max-h-80px">
				{lists.map((list) => (
					<Button size="small" asChild key={list.get('id')}>
						<Link to={`/lists/${list.get('id')}`}>{list.get('name')}</Link>
					</Button>
				))}
				<AddListButton size="small">
					<Icon name="plus" />
					New List
				</AddListButton>
			</div>
		</div>
	);
}
