import { migrateDown } from '@a-type/kysely';
import { db } from '../dist/index.js';
import migrations from '../dist/migrations/index.js';

await migrateDown(db, migrations, 1);
console.log('done');
