import { createMinimalGraphQLClient, graphql } from '@biscuits/graphql';
import { createMigration } from '@verdant-web/store';
import v4Schema, {
	MigrationTypes as V4Types,
} from '../client/schemaVersions/v4.js';
import v5Schema, {
	MigrationTypes as V5Types,
} from '../client/schemaVersions/v5.js';
import { API_HOST_HTTP } from '../config.js';

export default createMigration<V4Types, V5Types>(
	v4Schema,
	v5Schema,
	async ({ mutations }) => {
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
	},
);
