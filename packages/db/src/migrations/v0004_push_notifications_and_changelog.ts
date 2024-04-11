import { Kysely, sql } from 'kysely';

// push notifications and changelog

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('PushSubscription')
    .addColumn('endpoint', 'varchar', (c) => c.primaryKey().notNull())
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('auth', 'varchar')
    .addColumn('p256dh', 'varchar')
    .addColumn('userId', 'varchar')
    .execute();

  await db.schema
    .createTable('ChangelogItem')
    .addColumn('id', 'varchar', (c) => c.primaryKey().notNull())
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('title', 'varchar', (c) => c.notNull())
    .addColumn('details', 'text', (c) => c.notNull())
    .addColumn('imageUrl', 'varchar')
    .addColumn('important', 'boolean', (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('PushSubscription').ifExists().execute();
  await db.schema.dropTable('ChangelogItem').ifExists().execute();
}
