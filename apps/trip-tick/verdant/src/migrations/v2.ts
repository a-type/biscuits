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
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    await migrate('trips', async ({ days, ...old }) => {
      const endsAt = new Date();
      endsAt.setHours(0, 0, 0, 0);
      const startsAt = new Date(endsAt);
      startsAt.setDate(startsAt.getDate() - days);
      return {
        ...old,
        startsAt: startsAt.getTime(),
        endsAt: endsAt.getTime(),
      };
    });
  },
);
