#!/usr/bin/env node

import * as path from 'path';
import { promises as fs } from 'fs';
import { db } from './index.js';
import { Migrator, MigrationProvider, Migration } from 'kysely';
import url from 'url';
import migrations from './migrations/index.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export class FileMigrationProvider implements MigrationProvider {
  constructor() {}

  async getMigrations(): Promise<Record<string, Migration>> {
    return migrations;
  }
}

async function migrateToLatest() {
  console.log(__dirname);
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider(),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
