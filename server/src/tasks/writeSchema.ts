import { printSchema, lexicographicSortSchema } from 'graphql';
import { schema } from '../graphql/schema.js';
import { writeFile } from 'fs/promises';

export function writeSchema() {
	const sortedSchema = lexicographicSortSchema(schema);
	const printedSchema = printSchema(sortedSchema);
	writeFile('schema.graphql', printedSchema).catch((err) => {
		console.error('Error writing schema', err);
	});
}
