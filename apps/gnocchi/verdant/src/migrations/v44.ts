import v43Schema, {
  MigrationTypes as V43Types,
} from "../client/schemaVersions/v43.js";
import v44Schema, {
  MigrationTypes as V44Types,
} from "../client/schemaVersions/v44.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V43Types, V44Types>(
  v43Schema,
  v44Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
