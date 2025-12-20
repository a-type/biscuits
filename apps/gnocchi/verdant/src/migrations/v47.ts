import v46Schema, {
  MigrationTypes as V46Types,
} from "../client/schemaVersions/v46.js";
import v47Schema, {
  MigrationTypes as V47Types,
} from "../client/schemaVersions/v47.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V46Types, V47Types>(
  v46Schema,
  v47Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
