import { createMigration } from '@verdant-web/store';
import v2Schema, {
	MigrationTypes as V2Types,
} from '../client/schemaVersions/v2.js';
import v3Schema, {
	MigrationTypes as V3Types,
} from '../client/schemaVersions/v3.js';

export default createMigration<V2Types, V3Types>(
	v2Schema,
	v3Schema,
	async ({ migrate }) => {
		// add or modify migration logic here. you must provide migrations for
		// any collections that have changed field types or added new non-nullable
		// fields without defaults
		await migrate('people', async (old) => ({
			...old,
			geolocation: old.geolocation ? { ...old.geolocation, label: null } : null,
		}));
	},
);
