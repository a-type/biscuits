import { useMe, VerdantProfile } from '@biscuits/client';
import { createHooks } from '@names.biscuits/verdant';
import { useCallback, useMemo } from 'react';
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

export function useAddPerson() {
	const client = hooks.useClient();
	const { data: meData } = useMe();
	const selfId = meData?.me?.id;
	return useCallback(
		async (
			name: string,
			options: { attachLocation?: boolean } = { attachLocation: true },
		) => {
			console.log(options);
			const person = await client.people.put({
				name,
				createdBy: selfId,
			});
			// if allowed, record location
			if (options.attachLocation) {
				console.log('Attaching location to', name);
				// out of band location assignment
				hasGeolocationPermission()
					.then((hasPermission) => {
						if (!hasPermission) {
							console.error('Location permission was not granted.');
							return;
						}
						console.debug('Fetching location');
						return getGeolocation().then((location) => {
							console.debug('Fetched location', location);
							person.set('geolocation', {
								latitude: location.latitude,
								longitude: location.longitude,
							});
						});
					})
					.catch((err) => {
						console.error('Error fetching location', err);
					});
			}
			return person;
		},
		[client, selfId],
	);
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
