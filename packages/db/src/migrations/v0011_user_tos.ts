import { Kysely } from 'kysely';

// user tos

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('User')
    .addColumn('acceptedTosAt', 'datetime')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('User').dropColumn('acceptedTosAt').execute();
}
