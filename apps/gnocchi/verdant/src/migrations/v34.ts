import { createMigration } from '@verdant-web/store';
import v33Schema from '../client/schemaVersions/v33.js';
import v34Schema from '../client/schemaVersions/v34.js';

// @ts-ignore
export default createMigration(v33Schema, v34Schema);
