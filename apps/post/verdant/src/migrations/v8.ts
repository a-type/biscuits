import v7Schema, {
  MigrationTypes as V7Types,
} from "../client/schemaVersions/v7.js";
import v8Schema, {
  MigrationTypes as V8Types,
} from "../client/schemaVersions/v8.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V7Types, V8Types>(
  v7Schema,
  v8Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
