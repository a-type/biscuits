import * as prompt from '@clack/prompts';
import { exec } from 'child_process';

prompt.intro('Compress video');

const video = await prompt.text({
	message: 'Video to compress:',
	defaultValue: 'video.mp4',
});

if (prompt.isCancel(video)) {
	console.log('Cool.');
	process.exit(0);
}

const output = await prompt.text({
	message: 'Output file:',
	defaultValue: video.replace('.mp4', `-compressed.mp4`),
});

if (prompt.isCancel(output)) {
	console.log('Cool.');
	process.exit(0);
}

const spin = prompt.spinner();
spin.start('Compressing...');
exec(
	`ffmpeg -i web/public/videos/${video} -c:v libx265 -crf 25 -filter:v scale=-1:720 web/public/videos/${output}`,
	(err, stdout, stderr) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(stdout);
		console.error(stderr);
		spin.stop();
		prompt.outro('Done.');
		process.exit(0);
	},
);
