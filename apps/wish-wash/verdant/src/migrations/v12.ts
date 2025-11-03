import v11Schema, {
  MigrationTypes as V11Types,
} from "../client/schemaVersions/v11.js";
import v12Schema, {
  MigrationTypes as V12Types,
} from "../client/schemaVersions/v12.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V11Types, V12Types>(
  v11Schema,
  v12Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
