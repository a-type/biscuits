import copy from 'copy';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src/**/*.css');
const destDir = path.join(process.cwd(), 'dist');

copy(srcDir, destDir, function (err, files) {
	if (err) {
		console.error('Error copying CSS files:', err);
	} else {
		console.log('Copied CSS');
	}
});
