import v41Schema, {
  MigrationTypes as V41Types,
} from "../client/schemaVersions/v41.js";
import v42Schema, {
  MigrationTypes as V42Types,
} from "../client/schemaVersions/v42.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V41Types, V42Types>(
  v41Schema,
  v42Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
