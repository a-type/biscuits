import v5Schema, {
  MigrationTypes as V5Types,
} from '../client/schemaVersions/v5.js';
import v6Schema, {
  MigrationTypes as V6Types,
} from '../client/schemaVersions/v6.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V5Types, V6Types>(
  v5Schema,
  v6Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
    await migrate('lists', (old) => {
      return {
        ...old,
        items: old.items.map(({ link, imageFile, purchasedAt, ...rest }) => ({
          links: link ? [link] : [],
          imageFiles: imageFile ? [imageFile] : [],
          lastPurchasedAt: purchasedAt,
          purchasedCount: purchasedAt ? 1 : 0,
          ...rest,
        })),
      };
    });
  },
);
