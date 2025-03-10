import { createMigration } from '@verdant-web/store';
import v45Schema, {
	MigrationTypes as V45Types,
} from '../client/schemaVersions/v45.js';
import v46Schema, {
	MigrationTypes as V46Types,
} from '../client/schemaVersions/v46.js';

export default createMigration<V45Types, V46Types>(
	v45Schema,
	v46Schema,
	async ({ migrate }) => {
		// add or modify migration logic here. you must provide migrations for
		// any collections that have changed field types or added new non-nullable
		// fields without defaults
		// await migrate('collectionName', async (old) => ({ /* new */ }));
		await migrate('recipes', (old) => old);
	},
);
