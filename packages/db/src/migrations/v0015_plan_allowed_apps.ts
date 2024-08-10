import { Kysely } from 'kysely';

// plan allowed apps

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('plan').addColumn('allowedApp', 'text').execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('plan').dropColumn('allowedApp').execute();
}
