import { createMigration } from '@verdant-web/store';
import v5Schema, {
	MigrationTypes as V5Types,
} from '../client/schemaVersions/v5.js';
import v6Schema, {
	MigrationTypes as V6Types,
} from '../client/schemaVersions/v6.js';

export default createMigration<V5Types, V6Types>(
	v5Schema,
	v6Schema,
	async ({ migrate }) => {
		// add or modify migration logic here. you must provide migrations for
		// any collections that have changed field types or added new non-nullable
		// fields without defaults
		await migrate('notebooks', async ({ theme, font, ...old }) => ({
			...old,
			theme: {
				primaryColor: theme as
					| 'blueberry'
					| 'lemon'
					| 'tomato'
					| 'leek'
					| 'eggplant'
					| 'salt',
				fontStyle: font as 'serif' | 'sans-serif',
				spacing: 'md',
			},
		}));
	},
);
