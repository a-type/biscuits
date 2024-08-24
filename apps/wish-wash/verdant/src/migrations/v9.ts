import v8Schema, {
  MigrationTypes as V8Types,
} from "../client/schemaVersions/v8.js";
import v9Schema, {
  MigrationTypes as V9Types,
} from "../client/schemaVersions/v9.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V8Types, V9Types>(
  v8Schema,
  v9Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
