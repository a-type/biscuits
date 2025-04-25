import v10Schema, {
  MigrationTypes as V10Types,
} from "../client/schemaVersions/v10.js";
import v11Schema, {
  MigrationTypes as V11Types,
} from "../client/schemaVersions/v11.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V10Types, V11Types>(
  v10Schema,
  v11Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
