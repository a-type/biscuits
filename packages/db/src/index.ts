import { assert } from '@a-type/utils';
import { Database } from './tables.js'; // this is the Database interface we defined earlier
import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
export { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import { SerializePlugin } from 'kysely-plugin-serialize';
import {
  TimestampsPlugin,
  migrateToLatest as migrateInternal,
} from '@a-type/kysely';
import migrations from './migrations/index.js';

const DATABASE_FILE = process.env.DATABASE_FILE;
assert(DATABASE_FILE, 'DATABASE_FILE environment variable must be set');

const dialect = new SqliteDialect({
  database: new SQLite(DATABASE_FILE),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
  plugins: [new TimestampsPlugin({}), new SerializePlugin()],
});

export type DB = typeof db;

export {
  id,
  hashPassword,
  comparePassword,
  dateTime,
  compareDates,
} from '@a-type/kysely';

export function migrateToLatest() {
  return migrateInternal(db, migrations);
}
