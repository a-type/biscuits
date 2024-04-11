import { Kysely } from 'kysely';

// add member limit

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('Plan')
    .addColumn('memberLimit', 'integer', (col) => col.defaultTo(1))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('Plan').dropColumn('memberLimit').execute();
}
