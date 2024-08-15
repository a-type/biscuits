import v6Schema, {
  MigrationTypes as V6Types,
} from "../client/schemaVersions/v6.js";
import v7Schema, {
  MigrationTypes as V7Types,
} from "../client/schemaVersions/v7.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V6Types, V7Types>(
  v6Schema,
  v7Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
