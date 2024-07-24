import { Kysely, sql } from 'kysely';

// published recipes

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('PublishedWishlist')
    .addColumn('id', 'text', (b) => b.primaryKey())
    .addColumn('createdAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('publishedAt', 'datetime')
    .addColumn('publishedBy', 'text', (col) =>
      col.notNull().references('User.id').onDelete('cascade'),
    )
    .addColumn('planId', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('PublishedWishlist').execute();
}
