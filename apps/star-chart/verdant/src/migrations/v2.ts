import v1Schema, {
  MigrationTypes as V1Types,
} from '../client/schemaVersions/v1.js';
import v2Schema, {
  MigrationTypes as V2Types,
} from '../client/schemaVersions/v2.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V1Types, V2Types>(
  v1Schema,
  v2Schema,
  async ({ migrate, queries }) => {
    await migrate('connections', async (old) => {
      const source = await queries.tasks.get(old.sourceTaskId);
      let projectId = source?.projectId;
      if (!projectId) {
        console.error('Cannot find source task for connection');
        projectId = '';
      }
      return {
        ...old,
        projectId,
      };
    });
  },
);
