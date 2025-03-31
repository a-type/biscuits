import { createMigration } from '@verdant-web/store';
import v6Schema, {
	MigrationTypes as V6Types,
} from '../client/schemaVersions/v6.js';
import v7Schema, {
	MigrationTypes as V7Types,
} from '../client/schemaVersions/v7.js';

export default createMigration<V6Types, V7Types>(
	v6Schema,
	v7Schema,
	async ({ migrate }) => {
		// add or modify migration logic here. you must provide migrations for
		// any collections that have changed field types or added new non-nullable
		// fields without defaults
		await migrate('notebooks', async ({ theme, ...old }) => ({
			...old,
			theme: {
				...theme,
				corners: 'rounded' as const,
			},
		}));
	},
);
