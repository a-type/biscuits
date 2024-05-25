import { Kysely, sql } from 'kysely';

// published recipes

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('PublishedRecipe')
    .addColumn('id', 'text', (b) => b.primaryKey())
    .addColumn('createdAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('publishedAt', 'datetime')
    .addColumn('planId', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull())
    .addUniqueConstraint('PublishedRecipe_planId_slug_unique', [
      'planId',
      'slug',
    ])
    .execute();

  await db.schema
    .createIndex('PublishedRecipe_slug')
    .on('PublishedRecipe')
    .columns(['planId', 'slug'])
    .execute();
}

export async function down(db: Kysely<any>) {}
