#!/usr/bin/env node

import { confirm, intro, outro, spinner, text } from '@clack/prompts';
import { exec } from 'child_process';
import { cpTpl } from 'cp-tpl';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as url from 'url';

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
      - 'packages/apps/**'
      - '.github/workflows/deploy-${appId}.yml'
      - 'pnpm-workspace.yaml'

jobs:
  build-and-deploy-${appId}:
    name: Build and deploy ${appId}
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
        run: pnpm install --filter @${appId}.biscuits/web...

      - name: Build ${appId}
        run: pnpm --filter @${appId}.biscuits/web... run build
        env:
          VITE_API_ORIGIN: \${{ vars.API_ORIGIN }}
          VITE_HOME_ORIGIN: \${{ vars.HOME_ORIGIN }}
          VITE_PUBLIC_URL: https://${appId}.biscuits.club
          VITE_STRIPE_PUBLISHABLE_KEY: \${{ vars.STRIPE_PUBLISHABLE_KEY }}

      - name: Verify cloudflare token
        run: |
          curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
          -H "Authorization: Bearer \${{secrets.CLOUDFLARE_API_TOKEN}}" \
          -H "Content-Type:application/json"

      - name: Deploy app
        uses: cloudflare/wrangler-action@da0e0dfe58b7a431659754fdf3f186c529afbe65
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=prod-biscuits-${appId}-app

          packageManager: pnpm
          workingDirectory: ./apps/${appId}/web
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
