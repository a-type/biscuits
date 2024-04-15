import { Kysely } from 'kysely';

// user notify of new apps

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('User')
    .addColumn('sendEmailUpdates', 'boolean', (cb) =>
      cb.defaultTo(false).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('User').dropColumn('sendEmailUpdates').execute();
}
