import { createMinimalGraphQLClient, graphql } from '@biscuits/graphql';
import { createMigration } from '@verdant-web/store';
import v34Schema, {
	MigrationTypes as V34Types,
} from '../client/schemaVersions/v34.js';
import { API_HOST_HTTP } from '../config.js';

export default createMigration<V34Types>(v34Schema, async ({ mutations }) => {
	await mutations.collaborationInfo.put({});
	try {
		const client = createMinimalGraphQLClient({
			origin: API_HOST_HTTP,
		});
		const result = await client.query({
			query: graphql(`
				query DefaultCategories {
					foodCategories {
						id
						name
						sortKey
					}
				}
			`),
		});
		if (!result.data) {
			if (result.error) throw result.error;
			throw new Error('No data returned');
		}
		for (const defaultCategory of result.data.foodCategories) {
			await mutations.categories.put({
				id: defaultCategory.id.toString(),
				name: defaultCategory.name,
				sortKey: defaultCategory.sortKey,
			});
		}
	} catch (error) {
		console.error(error);
	}
});
