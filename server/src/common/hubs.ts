import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

const assetFileTypes: Record<string, string> = {
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.json': 'application/json',
	'.ico': 'image/x-icon',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
};

export async function staticFile(
	basePath: string,
	prefix: string,
	req: Request,
) {
	const url = new URL(req.url);
	const filePath = path.join(basePath, url.pathname.replace(`/${prefix}`, ''));

	if (!fsSync.existsSync(filePath)) {
		return new Response('Not found', { status: 404 });
	}

	const file = await fs.readFile(filePath);
	return new Response(file, {
		headers: {
			'Content-Type': assetFileTypes[path.extname(filePath)] ?? 'text/plain',
		},
	});
}

export function renderTemplate(
	indexTemplate: string,
	{
		data,
		appHtml,
		theme,
		globalStyle,
		cacheTime = 7 * 24 * 60 * 60,
	}: {
		appHtml: string;
		data?: any;
		theme?: string;
		globalStyle?: string;
		cacheTime?: number;
	},
) {
	let val = indexTemplate.replace(`<!--app-html-->`, appHtml);
	if (data) {
		val = val.replace(`{/*snapshot*/}`, JSON.stringify(data));
	}
	if (theme) {
		val = val.replace(/class="theme-\w+"/, `class="theme-${theme}"`);
	}
	if (globalStyle) {
		if (val.includes('<style id="global-style">')) {
			val = val.replace(
				'<style id="global-style">',
				`<style id="global-style">${globalStyle}`,
			);
		} else {
			val = val.replace(
				'</head>',
				`<style id="global-style">${globalStyle}</style></head>`,
			);
		}
	}
	return new Response(val, {
		headers: {
			'Content-Type': 'text/html',
			'Cache-Control': `public, max-age=${cacheTime}`,
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block',
			'Referrer-Policy': 'no-referrer',
			'Permissions-Policy': 'geolocation=(self), microphone=()',
			'Cross-Origin-Embedder-Policy': 'require-corp',
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Resource-Policy': 'same-origin',
		},
	});
}
