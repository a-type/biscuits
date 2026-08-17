import v47Schema, {
  MigrationTypes as V47Types,
} from "../client/schemaVersions/v47.js";
import v48Schema, {
  MigrationTypes as V48Types,
} from "../client/schemaVersions/v48.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V47Types, V48Types>(
  v47Schema,
  v48Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
