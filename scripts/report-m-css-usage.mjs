#!/usr/bin/env node

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const ignoredDirectories = new Set([
	'.git',
	'.idea',
	'.next',
	'.turbo',
	'.vscode',
	'.wrangler',
	'coverage',
	'dist',
	'build',
	'node_modules',
]);

const usagePattern = /--m-[A-Za-z0-9_-]+/g;

async function findSourceDirectories(directory) {
	const sourceDirectories = [];
	const entries = await fs.readdir(directory, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue;
		}

		if (ignoredDirectories.has(entry.name)) {
			continue;
		}

		const fullPath = path.join(directory, entry.name);

		if (entry.name === 'src') {
			sourceDirectories.push(fullPath);
			continue;
		}

		sourceDirectories.push(...(await findSourceDirectories(fullPath)));
	}

	return sourceDirectories;
}

async function findCssFiles(directory) {
	const cssFiles = [];
	const entries = await fs.readdir(directory, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			cssFiles.push(...(await findCssFiles(fullPath)));
			continue;
		}

		if (entry.isFile() && entry.name.toLowerCase().endsWith('.css')) {
			cssFiles.push(fullPath);
		}
	}

	return cssFiles;
}

function toRepoRelativePath(filePath) {
	return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

async function main() {
	const sourceDirectories = await findSourceDirectories(repoRoot);
	const cssFiles = [];

	for (const sourceDirectory of sourceDirectories) {
		cssFiles.push(...(await findCssFiles(sourceDirectory)));
	}

	const tokenToCount = new Map();
	const tokenToFiles = new Map();
	const fileToUsageCount = new Map();

	for (const cssFile of cssFiles) {
		const content = await fs.readFile(cssFile, 'utf8');
		const matches = content.match(usagePattern) ?? [];
		fileToUsageCount.set(cssFile, matches.length);

		for (const token of matches) {
			tokenToCount.set(token, (tokenToCount.get(token) ?? 0) + 1);

			if (!tokenToFiles.has(token)) {
				tokenToFiles.set(token, new Set());
			}

			tokenToFiles.get(token).add(cssFile);
		}
	}

	const results = Array.from(tokenToCount.entries())
		.map(([token, count]) => ({
			token,
			count,
			files: tokenToFiles.get(token)?.size ?? 0,
		}))
		.sort((a, b) => {
			if (b.count !== a.count) {
				return b.count - a.count;
			}
			return a.token.localeCompare(b.token);
		});

	const totalMatches = results.reduce((sum, result) => sum + result.count, 0);

	console.log('CSS --m-* usage report');
	console.log(`Source directories scanned: ${sourceDirectories.length}`);
	console.log(`CSS files scanned: ${cssFiles.length}`);
	console.log(`Unique tokens: ${results.length}`);
	console.log(`Total usages: ${totalMatches}`);

	if (results.length === 0) {
		console.log('\nNo --m-* usages found.');
		return;
	}

	console.log('\nCount\tFiles\tToken');
	for (const result of results) {
		console.log(`${result.count}\t${result.files}\t${result.token}`);
	}

	console.log('\nTop files by --m-* usages:');
	const topFiles = Array.from(fileToUsageCount.entries())
		.filter(([, usageCount]) => usageCount > 0)
		.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
		.slice(0, 15);

	for (const [cssFile, uniqueTokenCount] of topFiles) {
		console.log(`${uniqueTokenCount}\t${toRepoRelativePath(cssFile)}`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});