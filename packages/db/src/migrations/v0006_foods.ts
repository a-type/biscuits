import { Kysely, sql } from 'kysely';

// foods

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('Food')
    .addColumn('id', 'varchar', (c) => c.primaryKey())
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('canonicalName', 'varchar', (c) => c.notNull().unique())
    .execute();

  await db.schema
    .createTable('FoodName')
    .addColumn('id', 'varchar', (c) => c.primaryKey())
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('name', 'varchar', (c) => c.notNull())
    .addColumn('foodId', 'varchar', (c) =>
      c.notNull().references('Food.id').onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createTable('FoodCategory')
    .addColumn('id', 'varchar', (c) => c.primaryKey())
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('name', 'varchar', (c) => c.notNull().unique())
    .addColumn('sortKey', 'varchar', (c) => c.notNull())
    .execute();

  await db.schema
    .createTable('FoodCategoryAssignment')
    .addColumn('foodId', 'varchar', (c) =>
      c.notNull().references('Food.id').onDelete('cascade'),
    )
    .addColumn('categoryId', 'varchar', (c) =>
      c.notNull().references('FoodCategory.id').onDelete('cascade'),
    )
    .addColumn('votes', 'integer', (c) => c.notNull().defaultTo(1))
    .addUniqueConstraint('FoodCategoryAssignment_categoryId_foodId', [
      'categoryId',
      'foodId',
    ])
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('FoodCategoryAssignment').execute();
  await db.schema.dropTable('FoodCategory').execute();
  await db.schema.dropTable('FoodName').execute();
  await db.schema.dropTable('Food').execute();
}
