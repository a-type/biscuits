import { writeSchema } from '../src/tasks/writeSchema.js';
writeSchema();
console.log(
  'Wrote schema to packages/client/src/graphql.ts',
  new Date().toISOString(),
);
