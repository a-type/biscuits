import { Kysely, sql } from 'kysely';

// food name drop id

export async function up(db: Kysely<any>) {
  // WARNING: drops all foodname data, because right now
  // there isn't any in any environments anyway.

  // since id is the primary key, this requires creating a new table,
  // copying the data, and dropping the old table
  await db.schema.dropTable('FoodName').execute();

  await db.schema
    .createTable('FoodName')
    .ifNotExists()
    .addColumn('name', 'varchar', (c) => c.primaryKey().notNull())
    .addColumn('foodId', 'varchar', (c) =>
      c.notNull().references('Food.id').onDelete('cascade'),
    )
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('FoodName').execute();
  await db.schema
    .createTable('FoodName')
    .addColumn('id', 'varchar', (c) => c.primaryKey())
    .addColumn('name', 'varchar', (c) => c.notNull())
    .addColumn('foodId', 'varchar', (c) =>
      c.notNull().references('Food.id').onDelete('cascade'),
    )
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();
}
