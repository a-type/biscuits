import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { UserProfiles } from '@verdant-web/server';
import { createDb, userNameSelector } from '../services/db/index.js';

export class Profiles implements UserProfiles<BiscuitsVerdantProfile> {
	private db;
	constructor(d1: D1Database) {
		this.db = createDb(d1);
	}

	get = async (userId: string) => {
		const profile = await this.db
			.selectFrom('User')
			.select(['id', 'imageUrl'])
			.select(userNameSelector)
			.where('id', '=', userId)
			.executeTakeFirst();

		if (profile) {
			return {
				id: profile.id,
				name: profile.name,
				imageUrl: profile.imageUrl,
			};
		} else {
			return {
				id: userId,
				name: 'Anonymous',
				imageUrl: null,
			};
		}
	};
}
