import { Kysely } from 'kysely';

// notebook themes

export async function up(db: Kysely<any>) {
	await db.schema
		.alterTable('PublishedNotebook')
		.addColumn('theme', 'text')
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.alterTable('PublishedNotebook').dropColumn('theme').execute();
}
