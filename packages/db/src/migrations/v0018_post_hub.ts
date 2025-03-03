import { Kysely, sql } from 'kysely';

// post hub

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable('PublishedNotebook')
		.addColumn('id', 'text', (b) => b.primaryKey())
		.addColumn('createdAt', 'datetime', (b) =>
			b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn('updatedAt', 'datetime', (b) =>
			b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn('publishedBy', 'text', (b) =>
			b.notNull().references('User.id').onDelete('cascade'),
		)
		.addColumn('planId', 'text', (b) => b.notNull())
		.addColumn('name', 'text', (b) => b.notNull())
		.addColumn('coverImageUrl', 'text')
		.addColumn('iconUrl', 'text')
		.addColumn('description', 'text')
		.execute();

	await db.schema
		.createTable('PublishedPost')
		.addColumn('id', 'text', (b) => b.primaryKey())
		.addColumn('createdAt', 'datetime', (b) =>
			b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn('updatedAt', 'datetime', (b) =>
			b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn('publishedBy', 'text', (b) =>
			b.notNull().references('User.id').onDelete('cascade'),
		)
		.addColumn('notebookId', 'text', (b) =>
			b.notNull().references('PublishedNotebook.id').onDelete('cascade'),
		)
		.addColumn('slug', 'text', (b) => b.notNull())
		.addColumn('title', 'text', (b) => b.notNull())
		.addColumn('coverImageUrl', 'text')
		.addColumn('summary', 'text')
		.addColumn('body', 'text')
		.addUniqueConstraint('PublishedPost_notebookId_slug_unique', [
			'notebookId',
			'slug',
		])
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable('PublishedPost').execute();
	await db.schema.dropTable('PublishedNotebook').execute();
}
