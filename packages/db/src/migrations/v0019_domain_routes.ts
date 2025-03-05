import { Kysely, sql } from 'kysely';

// domain routes

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable('DomainRoute')
		.addColumn('id', 'text', (b) => b.primaryKey())
		.addColumn('createdAt', 'datetime', (b) =>
			b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn('updatedAt', 'datetime', (b) =>
			b.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn('domain', 'text', (b) => b.notNull().unique())
		.addColumn('dnsVerifiedAt', 'datetime')
		.addColumn('planId', 'text', (b) =>
			b.notNull().references('Plan.id').onDelete('cascade'),
		)
		.addColumn('appId', 'text', (b) => b.notNull())
		.addColumn('resourceId', 'text', (b) => b.notNull())
		.execute();

	await db.schema
		.createIndex('DomainRoute_appId_resourceId_index')
		.on('DomainRoute')
		.columns(['appId', 'resourceId'])
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropIndex('DomainRoute_appId_resourceId_index').execute();
	await db.schema.dropTable('DomainRoute').execute();
}
