import v42Schema, {
  MigrationTypes as V42Types,
} from "../client/schemaVersions/v42.js";
import v43Schema, {
  MigrationTypes as V43Types,
} from "../client/schemaVersions/v43.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V42Types, V43Types>(
  v42Schema,
  v43Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
