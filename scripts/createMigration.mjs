import { isCancel } from '@clack/prompts';
import { intro, outro, text } from '@clack/prompts';
import * as path from 'path';
import * as fs from 'fs/promises';
import { format } from 'prettier';
import { URL } from 'url';

intro('Create a new migration');

const res = await text({
  message: 'Migration name',
  defaultValue: 'unnamed',
});
if (isCancel(res)) {
  outro('Cancelled');
  process.exit(0);
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// read current version
const migrationsDir = path.resolve(
  import.meta.dirname ?? __dirname,
  '../packages/db/src/migrations',
);
const migrationFiles = await fs.readdir(migrationsDir);
// only starting with v#
const versions = migrationFiles
  .filter((f) => f.startsWith('v'))
  .map((f) => parseInt(f.slice(1), 10))
  .sort((a, b) => a - b);
const latestVersion = versions[versions.length - 1];
const nextVersion = latestVersion + 1;

const name = res.toLowerCase().replace(/\s/g, '_');
const fileName = `v${nextVersion}_${name}.ts`;

const fileContent = `import { Kysely } from 'kysely';

// ${res}

export async function up(db: Kysely<any>) {
  // so that the dev server doesn't immediately apply a no-op.
  throw new Error('Not implemented');
}

export async function down(db: Kysely<any>) {

}
`;

await fs.writeFile(
  path.join(migrationsDir, fileName),
  await format(fileContent, { parser: 'typescript' }),
);

// update index
const indexFile = path.join(migrationsDir, 'index.ts');
const indexContent = await fs.readFile(indexFile, 'utf-8');
// find "export default { ... };"
const exportDefaultIndex = indexContent.indexOf('export default {');
// insert "import * as v# from './v#_name';" before that
const newContent = `${indexContent.slice(0, exportDefaultIndex)}\nimport * as v${nextVersion} from './${fileName.replace('.ts', '.js')}';\n${indexContent.slice(exportDefaultIndex)}`;
// insert ", v#" into the exported object
const exportIndex = newContent.indexOf('};', exportDefaultIndex);
const newExport = `${newContent.slice(0, exportIndex)},\n  v${nextVersion}${newContent.slice(exportIndex)}`;

await fs.writeFile(
  indexFile,
  await format(newExport, { parser: 'typescript' }),
);

outro(`Created migration ${res}`);
