import { printSchema, lexicographicSortSchema } from 'graphql';
import { schema } from '../graphql/schema.js';
import { writeFileSync } from 'fs';

export function writeSchema() {
  const sortedSchema = lexicographicSortSchema(schema);
  const printedSchema = printSchema(sortedSchema);
  writeFileSync('schema.graphql', printedSchema);
}
