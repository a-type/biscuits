#!/usr/bin/env node

import { confirm, intro, outro, spinner, text } from '@clack/prompts';
import { cpTpl } from 'cp-tpl';
import * as fs from 'fs/promises';
import { exec } from 'node:child_process';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

intro('create biscuits worker');

const name = await text({
	message: 'What is the worker name?',
	placeholder: 'new worker',
	initialValue: '',
	validate: (value) => {
		if (value === '') {
			return 'Please enter a name';
		}
	},
});

const workerId = name.toLowerCase().replace(/\s/g, '-');

const destinationDir = path.resolve(process.cwd(), 'workers', workerId);

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
		'{{todoId}}': workerId,
		'.env-template': '.env',
		'.gitignore-template': '.gitignore',
	},
	gitignore: true,
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
      - 'workers/${workerId}/**'
      - '.github/workflows/deploy-worker-${workerId}.yml'
      - 'pnpm-workspace.yaml'

jobs:
  build-and-deploy-${workerId}:
    name: Build and deploy ${workerId}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Setup pnpm
        uses: pnpm/action-setup@v2.0.1
        with:
          version: 9.15.2
      - name: Setup node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --filter @worker.biscuits/${workerId}...

      - name: Verify cloudflare token
        run: |
          curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \\
          -H "Authorization: Bearer \${{secrets.CLOUDFLARE_API_TOKEN}}" \\
          -H "Content-Type:application/json"

      - name: Deploy app
        uses: cloudflare/wrangler-action@da0e0dfe58b7a431659754fdf3f186c529afbe65
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: deploy
          packageManager: pnpm
          workingDirectory: ./workers/${workerId}/web
`;
await fs.writeFile(
	path.resolve(
		process.cwd(),
		`.github/workflows/deploy-worker-${workerId}.yml`,
	),
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
