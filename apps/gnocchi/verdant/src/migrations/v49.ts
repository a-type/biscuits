import v48Schema, {
  MigrationTypes as V48Types,
} from "../client/schemaVersions/v48.js";
import v49Schema, {
  MigrationTypes as V49Types,
} from "../client/schemaVersions/v49.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V48Types, V49Types>(
  v48Schema,
  v49Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
