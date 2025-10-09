import * as fs from 'fs/promises';
import * as path from 'path';

async function copyDir(src: string, dest: string) {
	await fs.mkdir(dest, { recursive: true });
	const entries = await fs.readdir(src, { withFileTypes: true });
	for (const entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);
		if (entry.isDirectory()) {
			await copyDir(srcPath, destPath);
		} else if (entry.isFile()) {
			await fs.copyFile(srcPath, destPath);
		}
	}
}

async function main() {
	const hubApps = ['gnocchi', 'post'];
	for (const app of hubApps) {
		const src = path.join(
			import.meta.dirname,
			'..',
			'..',
			'..',
			'apps',
			app,
			'hub',
			'dist',
		);
		const dest = path.join(import.meta.dirname, '..', 'assets', 'hubs', app);
		console.log(`Copying ${src} to ${dest}`);
		await copyDir(src, dest);
	}
}

main();
