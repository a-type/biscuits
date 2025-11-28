import { authorization, createMigration } from '@verdant-web/store';
import v1Schema, {
	MigrationTypes as V1Types,
} from '../client/schemaVersions/v1.js';
import v2Schema, {
	MigrationTypes as V2Types,
} from '../client/schemaVersions/v2.js';

export default createMigration<V1Types, V2Types>(
	v1Schema,
	v2Schema,
	async ({ migrate, info, mutations, queries }) => {
		// copy tags to tagMetadata
		const allTags = await queries.tags.findAll();
		for (const tag of allTags) {
			await mutations.tagMetadata.put(tag, {
				access: authorization.private,
			});
		}
	},
);
