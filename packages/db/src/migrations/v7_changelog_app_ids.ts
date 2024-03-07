import { Kysely } from 'kysely';

// changelog app ids

export async function up(db: Kysely<any>) {
  // so that the dev server doesn't immediately apply a no-op.
  await db.schema
    .alterTable('ChangelogItem')
    .addColumn('appId', 'varchar', (c) => c.notNull().defaultTo('gnocchi'))
    .execute();

  await db.schema
    .createIndex('ChangelogItem_appId')
    .on('ChangelogItem')
    .column('appId')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('ChangelogItem').dropColumn('appId').execute();
}
