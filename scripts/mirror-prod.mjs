import * as prompt from '@clack/prompts';
import * as fs from 'fs';

prompt.intro('Biscuits data mirroring');

// read directories in ./backups
const backups = fs.readdirSync('./backups').filter((f) => f !== '.gitkeep');

// prompt for which backup to use
const backup = await prompt.select({
  message: 'Which backup?',
  options: [
    ...backups
      .sort((a, b) => -a.localeCompare(b))
      .map((b) => ({
        value: b,
        label: b,
      })),
    { value: 'restore', label: 'Restore before last backup' },
  ],
  maxItems: 10,
});

if (prompt.isCancel(backup)) {
  console.log('Cool.');
  process.exit(0);
}

if (backup === 'restore') {
  // restore the backup
  console.log('Restoring backup...');
  const lastBackup = backups[backups.length - 1];
  fs.copyFileSync(`./server/storage.sqlite.bak`, './server/storage.sqlite');
  fs.copyFileSync(`./server/database.sqlite.bak`, './server/database.sqlite');
  fs.rmSync(`./server/storage.sqlite.bak`);
  fs.rmSync(`./server/database.sqlite.bak`);
  console.log('Done.');
  process.exit(0);
}

// make a backup of the current databases
if (fs.existsSync('./server/storage.sqlite')) {
  fs.copyFileSync('./server/storage.sqlite', './server/storage.sqlite.bak');
}
if (fs.existsSync('./server/database.sqlite')) {
  fs.copyFileSync('./server/database.sqlite', './server/database.sqlite.bak');
}
fs.copyFileSync(
  `./backups/${backup}/storage.sqlite`,
  './server/storage.sqlite',
);
fs.copyFileSync(
  `./backups/${backup}/database.sqlite`,
  './server/database.sqlite',
);
prompt.outro('Done.');
