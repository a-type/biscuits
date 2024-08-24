import { Kysely, sql } from 'kysely';

// wishlist purchases

export async function up(db: Kysely<any>) {
  // so that the dev server doesn't immediately apply a no-op.
  await db.schema
    .createTable('WishlistPurchase')
    .addColumn('id', 'text', (b) => b.primaryKey())
    .addColumn('createdAt', 'datetime', (b) =>
      b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (b) =>
      b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('wishlistId', 'text', (b) =>
      b.notNull().references('PublishedWishlist.id').onDelete('cascade'),
    )
    .addColumn('purchasedBy', 'text', (b) => b.notNull())
    .addColumn('quantity', 'integer', (b) => b.notNull().defaultTo(1))
    .addColumn('confirmedAt', 'datetime')
    .addColumn('itemId', 'text', (b) => b.notNull())
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('WishlistPurchase').execute();
}
