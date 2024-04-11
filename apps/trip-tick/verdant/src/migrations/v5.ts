import v4Schema, {
  MigrationTypes as V4Types,
} from '../client/schemaVersions/v4.js';
import v5Schema, {
  MigrationTypes as V5Types,
} from '../client/schemaVersions/v5.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V4Types, V5Types>(
  v4Schema,
  v5Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
    await migrate('lists', ({ items, ...rest }) => {
      return {
        ...rest,
        hotThreshold: 80,
        coldThreshold: 40,
        items: items.map(({ perDays, ...rest }) => ({
          // perDays is 0 for "trip" mode in the old schema - make it 1
          // and interpret.
          periodMultiplier: perDays || 1,
          period: perDays ? 'day' : 'trip',
          ...rest,
        })),
      };
    });
  },
);
