import { TimestampsPlugin } from '@a-type/kysely';
import { Kysely, sql } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { SerializePlugin } from 'kysely-plugin-serialize';
import { Database } from './tables.js'; // this is the Database interface we defined earlier
export { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
export type * from './tables.js';

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const createDb = (d1: any) =>
	new Kysely<Database>({
		dialect: new D1Dialect({ database: d1 }),
		plugins: [
			new TimestampsPlugin({
				ignoredTables: ['FoodCategoryAssignment'],
			}),
			new SerializePlugin(),
		],
	});

export type DB = Kysely<Database>;

export {
	compareDates,
	comparePassword,
	dateTime,
	hashPassword,
	id,
} from '@a-type/kysely';
export { sql } from 'kysely';

/** Selects the user name - prefers friendlyName, falls back to fullName */
export const userNameSelector =
	sql<string>`COALESCE(User.friendlyName, User.fullName)`.as('name');
