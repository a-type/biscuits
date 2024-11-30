import { Kysely, sql } from 'kysely';

// wishlist purchases

export async function up(db: Kysely<any>) {
	// so that the dev server doesn't immediately apply a no-op.
	await db.schema
		.createTable('UserUsageLimit')
		.addColumn('userId', 'text', (b) =>
			b.notNull().references('User.id').onDelete('cascade'),
		)
		.addColumn('limitType', 'text', (b) => b.notNull())
		.addColumn('uses', 'integer', (b) => b.notNull().defaultTo(0))
		.addColumn('resetsAt', 'datetime', (b) => b.notNull())
		.addColumn('createdAt', 'datetime', (b) =>
			b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn('updatedAt', 'datetime', (b) =>
			b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addPrimaryKeyConstraint('UserUsageLimit_pk', ['userId', 'limitType'])
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable('UserUsageLimit').execute();
}
