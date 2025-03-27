import v4Schema, {
  MigrationTypes as V4Types,
} from "../client/schemaVersions/v4.js";
import v5Schema, {
  MigrationTypes as V5Types,
} from "../client/schemaVersions/v5.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V4Types, V5Types>(
  v4Schema,
  v5Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
