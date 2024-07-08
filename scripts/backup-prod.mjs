import * as child from 'child_process';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import { promisify } from 'util';

// esm dirname
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const nowString = new Date().toISOString().replace(/:/g, '-');
const backupDirName = path.resolve(process.cwd(), `backups/${nowString}`);
fs.mkdirSync(backupDirName, { recursive: true });

const backupFileName = path.resolve(backupDirName, 'database.sqlite');
const backupVerdantFileName = path.resolve(backupDirName, 'storage');

// pull the files from Fly
const exec = promisify(child.exec);
await exec(`flyctl ssh sftp get /data/database.sqlite ${backupFileName}`);
await exec(`flyctl ssh sftp get /data/storage ${backupVerdantFileName}`);
