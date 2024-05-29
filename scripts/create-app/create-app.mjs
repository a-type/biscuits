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

function constify(str) {
  return str.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}
const deployAction = `name: ${name} deploy
on:
  push:
    branches: [main]
    paths:
      - 'apps/${appId}/**'
      - 'packages/client/**'
      - '.github/workflows/deploy-${appId}.yml'

jobs:
  build-and-deploy-${appId}:
    name: Build and deploy ${appId}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2.0.1
        with:
          version: 8.12.1

      - name: Setup node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --filter @${appId}.biscuits/web...

      - name: Build ${appId}
        run: pnpm --filter @${appId}.biscuits/web... run build

      - name: Deploy ${appId} to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --follow-symlinks --delete
        env:
          AWS_S3_BUCKET: \${{ secrets.S3_BUCKET_${constify(appId)} }}
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: './apps/${appId}/web/dist'

      - name: Invalidate CloudFront cache
        uses: chetan/invalidate-cloudfront-action@v2
        env:
          AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          DISTRIBUTION: \${{ secrets.CLOUDFRONT_ID_${constify(appId)} }}
          PATHS: '/*'
          AWS_REGION: 'us-east-1'
`;
await fs.writeFile(
  path.resolve(process.cwd(), `.github/workflows/deploy-${appId}.yml`),
  deployAction,
);

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

installSpinner.stop('App created.');

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
