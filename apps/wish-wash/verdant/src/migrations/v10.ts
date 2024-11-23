import v9Schema, {
	MigrationTypes as V9Types,
} from '../client/schemaVersions/v9.js';
import v10Schema, {
	MigrationTypes as V10Types,
} from '../client/schemaVersions/v10.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V9Types, V10Types>(
	v9Schema,
	v10Schema,
	async ({ migrate }) => {
		// add or modify migration logic here. you must provide migrations for
		// any collections that have changed field types or added new non-nullable
		// fields without defaults
		// await migrate('collectionName', async (old) => ({ /* new */ }));
		await migrate('lists', (old) => {
			return {
				...old,
				items: old.items.map((item) => ({
					...item,
					type: item.type === 'product' ? 'link' : item.type,
				})),
			};
		});
	},
);
