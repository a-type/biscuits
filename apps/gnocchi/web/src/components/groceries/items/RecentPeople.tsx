import {
	PeopleList,
	PeopleListItem,
} from '@/components/sync/people/People.jsx';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.jsx';
import { hooks, Person } from '@/stores/groceries/index.js';
import { Item } from '@gnocchi.biscuits/verdant';
import { useEffect, useState } from 'react';

export function RecentPeople({
	item,
	className,
}: {
	item: Item;
	className?: string;
}) {
	const people = usePeopleWhoLastEditedThis(item.get('id'));

	if (people.length === 0) {
		return null;
	}

	return (
		<PeopleList count={people.length} className={className}>
			{people.map((person, index) => (
				<PeopleListItem index={index} key={person.profile.id}>
					<PersonAvatar
						key={person.profile.id}
						person={person}
						className="relative left-[calc(var(--index)*-8px)] z-[var(--index)]"
					/>
				</PeopleListItem>
			))}
		</PeopleList>
	);
}

function usePeopleWhoLastEditedThis(itemId: string) {
	const groceries = hooks.useClient();
	const [people, setPeople] = useState<Person[]>(() => {
		return Object.values(groceries.sync.presence.peers).filter(
			(p) => p.presence.lastInteractedItem === itemId,
		);
	});
	useEffect(() => {
		return groceries.sync.presence.subscribe('peersChanged', () => {
			setPeople(
				Object.values(groceries.sync.presence.peers).filter(
					(p) => p.presence.lastInteractedItem === itemId,
				),
			);
		});
	}, [groceries.sync.presence, itemId]);

	return people;
}
