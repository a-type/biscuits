import { writeFile } from 'fs/promises';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { join } from 'path';
import { schema } from '../graphql/schema.js';

export function writeSchema() {
	const sortedSchema = lexicographicSortSchema(schema);
	const printedSchema = printSchema(sortedSchema);
	writeFile(
		join(import.meta.dirname, '../../../packages/graphql/schema.graphql'),
		printedSchema,
	).catch((err) => {
		console.error('Error writing schema', err);
	});
}
