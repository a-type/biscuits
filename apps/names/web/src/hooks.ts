import { useHasServerAccess, useMe, VerdantProfile } from '@biscuits/client';
import { graphql, graphqlClient } from '@biscuits/graphql';
import { createHooks, Person } from '@names.biscuits/verdant';
import { useCallback, useMemo, useState } from 'react';
import {
	getGeolocation,
	hasGeolocationPermission,
} from './services/location.js';
import { Presence } from './store.js';

export const hooks = createHooks<Presence, VerdantProfile>();

export function useAddRelationship() {
	const client = hooks.useClient();
	return useCallback(
		async (personAId: string, personBId: string) => {
			const computedId = [personAId, personBId].sort().join(':');
			const rel = await client.relationships.put({
				id: computedId,
				personAId,
				personBId,
			});
			return rel;
		},
		[client],
	);
}

const lookupLocation = graphql(`
	query lookupLocation($latitude: Float!, $longitude: Float!) {
		locationAddress(latitude: $latitude, longitude: $longitude, format: CITY)
	}
`);

export function useAddPerson() {
	const client = hooks.useClient();
	const { data: meData } = useMe();
	const selfId = meData?.me?.id;

	return useCallback(
		async (name: string) => {
			const person = await client.people.put({
				name,
				createdBy: selfId,
			});
			return person;
		},
		[client, selfId],
	);
}

export function useAddLocation() {
	const canLookup = useHasServerAccess();
	const client = hooks.useClient();
	const [loading, setLoading] = useState(false);
	const attach = useCallback(
		async (person: Person) => {
			try {
				setLoading(true);
				console.log('Attaching location to', person.get('name'));
				// out of band location assignment
				const hasPermission = await hasGeolocationPermission();
				if (!hasPermission) {
					console.error('Location permission was not granted.');
					return;
				}
				console.debug('Fetching location');
				const location = await getGeolocation();
				console.debug('Fetched location', location);
				client.batch({ batchName: 'geolocation' }).run(() => {
					person.set('geolocation', {
						latitude: location.latitude,
						longitude: location.longitude,
					});
				});

				// if allowed, lookup place name
				if (!canLookup) return;

				const lookupResult = await graphqlClient.query({
					query: lookupLocation,
					variables: {
						latitude: location.latitude,
						longitude: location.longitude,
					},
				});
				const address = lookupResult.data.locationAddress;
				if (address) {
					client.batch({ batchName: 'geolocation' }).run(() => {
						const location = person.get('geolocation');
						location?.set('label', address);
					});
				}
			} finally {
				setLoading(false);
			}
		},
		[canLookup, client],
	);

	return [attach, loading] as const;
}

export function useRecentPeople(tagFilter?: string[]) {
	const firstTag = tagFilter?.[0];
	const [recentPeopleRaw, pages] = hooks.useAllPeopleInfinite({
		index:
			firstTag ?
				{ where: 'tag_createdAt', match: { tags: firstTag }, order: 'desc' }
			:	{
					where: 'createdAt',
					order: 'desc',
				},
		key: 'recentPeople',
		pageSize: 10,
	});

	const recentPeople = recentPeopleRaw.filter((person) =>
		tagFilter?.every((tag) => person.get('tags').has(tag)),
	);

	return [recentPeople, pages] as const;
}

export function useDeleteTag() {
	const client = hooks.useClient();

	return useMemo(() => {
		async function deleteTag(tagName: string) {
			tagName = tagName.toLowerCase().trim();
			const tag = await client.tags.get(tagName).resolved;
			const tagInit = tag?.getSnapshot() ?? null;
			const matches = await client.people.findAll({
				index: { where: 'tags', equals: tagName },
			}).resolved;
			client.batch({ undoable: false }).run(() => {
				for (const match of matches) {
					match.get('tags').removeAll(tagName);
				}
			});
			await client.tags.delete(tagName, {
				undoable: false,
			});
			function undoDeleteTag() {
				if (tagInit) {
					client.tags.put(tagInit);
					for (const match of matches) {
						match.get('tags').add(tagName);
					}
				}

				return async function () {
					deleteTag(tagName);
					return () => undoDeleteTag();
				};
			}
			client.undoHistory.addUndo(undoDeleteTag);
		}
		return deleteTag;
	}, [client]);
}

export function useRelationshipSuggestions(person: Person) {
	const { id: ownId, name, dismissedSuggestions } = hooks.useWatch(person);
	hooks.useWatch(dismissedSuggestions);
	const surname = name.split(' ').pop();

	const unfilteredMatches = hooks.useAllPeople({
		index: {
			where: 'matchName',
			equals: surname?.toLowerCase() ?? '',
		},
		key: 'relationshipMatches',
	});

	const matches = useMemo(() => {
		return (
			unfilteredMatches
				.filter((match) => match.get('id') !== ownId)
				// only match names with surnames
				.filter((match) => match.get('name').includes(' '))
				.filter((match) => !dismissedSuggestions.has(match.get('id')))
		);
	}, [unfilteredMatches, dismissedSuggestions, ownId]);

	return matches;
}

export function useJustAddedPeople() {
	return hooks.useAllPeople({
		index: {
			where: 'createdAt',
			order: 'desc',
			gte: new Date(Date.now() - 1000 * 60 * 60).getTime(), // last hour
		},
		key: 'justAddedPeople',
	});
}
