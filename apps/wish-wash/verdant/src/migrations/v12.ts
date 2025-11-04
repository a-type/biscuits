import { createMigration } from '@verdant-web/store';
import v11Schema, {
	MigrationTypes as V11Types,
} from '../client/schemaVersions/v11.js';
import v12Schema, {
	MigrationTypes as V12Types,
} from '../client/schemaVersions/v12.js';

export default createMigration<V11Types, V12Types>(
	v11Schema,
	v12Schema,
	async ({ migrate }) => {
		await migrate('lists', (list) => list);
	},
);
