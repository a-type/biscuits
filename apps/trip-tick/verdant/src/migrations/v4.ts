import v3Schema, {
  MigrationTypes as V3Types,
} from "../client/schemaVersions/v3.js";
import v4Schema, {
  MigrationTypes as V4Types,
} from "../client/schemaVersions/v4.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V3Types, V4Types>(
  v3Schema,
  v4Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
