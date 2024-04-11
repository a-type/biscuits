import { Kysely } from 'kysely';

// add user preferences

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('User')
    .addColumn('preferences', 'text', (cb) => cb.defaultTo('{}').notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('User').dropColumn('preferences').execute();
}
