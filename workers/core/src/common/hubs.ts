import { Context } from 'hono';
import * as path from 'path';
import { HonoEnv } from '../config/hono.js';

export async function staticFile(
	appName: string,
	type: 'client' | 'server',
	ctx: Context<HonoEnv>,
	prefix?: string,
	file?: string, // if not provided, inherits from ctx.req
) {
	const url = new URL(ctx.req.raw.url);
	const unprefixedPath =
		file ? `/${file}`
		: prefix ? url.pathname.replace(`/${prefix}`, '')
		: url.pathname;
	const filePath = path.join('hubs', appName, type, unprefixedPath);

	url.pathname = `/${filePath}`;

	console.debug(`Fetching static asset: ${url.pathname}`);
	const assetReq = new Request(url);

	return ctx.env.ASSETS.fetch(assetReq);
}

export async function renderTemplate(
	appName: string,
	ctx: Context<HonoEnv>,
	{
		data,
		appHtml,
		theme,
		globalStyle,
		cacheTime = 7 * 24 * 60 * 60,
		title,
	}: {
		appHtml: string;
		data?: any;
		theme?: string;
		globalStyle?: string;
		cacheTime?: number;
		title?: string;
	},
) {
	const indexRes = await staticFile(
		appName,
		'client',
		ctx,
		undefined,
		'index.html',
	);
	if (!indexRes.ok) {
		console.error(`Failed to load index.html for ${appName} hub`, indexRes);
		return new Response('Not found', { status: 404 });
	}
	const indexTemplate = await indexRes.text();

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
	if (title) {
		val = val.replace(/<title>.*<\/title>/, `<title>${title}</title>`);
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
