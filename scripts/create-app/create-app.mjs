#!/usr/bin/env node

import {
  intro,
  outro,
  spinner,
  text,
  confirm,
  note,
  select,
  isCancel,
} from '@clack/prompts';
import { cpTpl } from 'cp-tpl';
import * as url from 'url';
import * as path from 'path';
import { exec } from 'child_process';
import * as fs from 'fs/promises';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

intro('create biscuits app');

const name = await text({
  message: 'What is the app name?',
  placeholder: 'new app',
  initialValue: '',
  validate: (value) => {
    if (value === '') {
      return 'Please enter a name';
    }
  },
});

const appId = name.toLowerCase().replace(/\s/g, '-');

const destinationDir = path.resolve(process.cwd(), 'apps', appId);

const exists = await fs
  .access(destinationDir)
  .then(() => true)
  .catch(() => false);

if (exists) {
  const overwrite = await confirm({
    message: 'This directory already exists. Do you want to overwrite it?',
  });
  if (!overwrite) {
    outro('Cancelled');
    process.exit(1);
  } else {
    const deleteSpinner = spinner();
    deleteSpinner.start('Deleting directory...');
    await fs.rm(destinationDir, { recursive: true });
    deleteSpinner.stop('Directory deleted');
  }
}

const copySpinner = spinner();

copySpinner.start('Copying files...');

const dontCopy = [
  'node_modules/**/*',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

const copyConfig = {
  replace: {
    '{{todo}}': name,
    '{{todoId}}': appId,
    '.env-template': '.env',
    '.gitignore-template': '.gitignore',
  },
  gitingore: true,
  exclude: dontCopy,
};

await cpTpl(path.resolve(__dirname, `./template`), destinationDir, copyConfig);

copySpinner.stop('Copying complete');

const installSpinner = spinner();

installSpinner.start('Installing dependencies...');

// exec pnpm i in the new directory
await execAsync('pnpm i', {
  cwd: process.cwd(),
});

installSpinner.stop('Dependencies installed');

installSpinner.start('Generating verdant code...');

const verdantDir = path.resolve(destinationDir, 'verdant');

// exec pnpm generate in the new directory
await execAsync('pnpm generate --select=wip --module=esm', {
  cwd: verdantDir,
});

installSpinner.stop(
  'Your first Verdant schema has been created in WIP mode. You can try out your app immediately! Edit your schema and run `pnpm generate` to generate a new version.',
);

exec('code ./packages/apps/src/index.ts', {
  cwd: process.cwd(),
});

outro('Done!');

async function execAsync(command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
