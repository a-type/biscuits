import { Kysely } from 'kysely';

// push app id

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('PushSubscription')
    .addColumn('appId', 'varchar', (c) => c.notNull().defaultTo('gnocchi'))
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('PushSubscription').dropColumn('appId').execute();
}
