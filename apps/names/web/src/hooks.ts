import { useMe, VerdantProfile } from '@biscuits/client';
import { createHooks } from '@names.biscuits/verdant';
import { useCallback } from 'react';
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
			const person = await client.people.put({
				name,
				createdBy: selfId,
			});
			// if allowed, record location
			if (options.attachLocation && (await hasGeolocationPermission())) {
				// out of band location assignment
				getGeolocation().then((location) => {
					person.set('geolocation', {
						latitude: location.latitude,
						longitude: location.longitude,
					});
				});
			}
			return person;
		},
		[client, selfId],
	);
}
