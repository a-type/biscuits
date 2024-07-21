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
    await migrate('lists', async ({ hotThreshold, coldThreshold, ...old }) => {
      const items: V6Types['lists']['init']['items'] = old.items.map(
        ({ condition, ...item }) => {
          switch (condition) {
            case 'cold':
              return {
                ...item,
                conditions: [
                  {
                    type: 'cold',
                    params: { temperature: coldThreshold },
                  },
                ],
              };
            case 'hot':
              return {
                ...item,
                conditions: [
                  {
                    type: 'hot',
                    params: { temperature: hotThreshold },
                  },
                ],
              };
            case 'rain':
              return {
                ...item,
                conditions: [
                  {
                    type: 'rain',
                  },
                ],
              };
            default:
              return {
                ...item,
                conditions: [],
              };
          }
        },
      );

      return {
        ...old,
        items,
      };
    });
  },
);
