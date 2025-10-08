import { generateOutput } from '@gql.tada/cli-utils';
import { writeSchema } from '../src/tasks/writeSchema.js';

writeSchema();
await generateOutput({
	output: '../../packages/graphql/src/graphql-env.d.ts',
	disablePreprocessing: false,
	tsconfig: '../../packages/graphql/tsconfig.json',
});
console.log('Wrote schema to schema.graphql', new Date().toISOString());
