import v44Schema, {
  MigrationTypes as V44Types,
} from "../client/schemaVersions/v44.js";
import v45Schema, {
  MigrationTypes as V45Types,
} from "../client/schemaVersions/v45.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V44Types, V45Types>(
  v44Schema,
  v45Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
