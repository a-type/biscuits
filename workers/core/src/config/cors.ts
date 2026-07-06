import { apps } from '@biscuits/apps';
import { URL } from 'url';

const uiOriginWithWWW = (env: Env) => {
	const url = new URL(env.UI_ORIGIN);
	url.hostname = `www.${url.hostname}`;
	return url.toString().slice(0, -1);
};

export const ALLOWED_ORIGINS = (env: Env) => [
	'http://localhost:6123',
	env.UI_ORIGIN,
	// remove trailing slash
	uiOriginWithWWW(env),
	// old apps - allowed for transfer purposes
	'https://gnocchi.club',
	'https://www.gnocchi.club',
	'https://packing-list.gfor.rest',
	// including localhost versions
	'http://localhost:6299',
	'http://localhost:4444',
	// app origins
	...apps.map((app) => app.url),
	...apps.map((app) => app.devOriginOverride),
];

export const EXPOSED_HEADERS = [
	'Content-Type',
	'Content-Length',
	'X-Request-Id',
	'Set-Cookie',
	'X-Biscuits-Error',
	'X-Biscuits-Message',
	'X-Csrf-Token',
	'X-Route-Id',
];

export const ALLOWED_HEADERS = [
	'Authorization',
	'Content-Type',
	'X-Request-Id',
	'X-Csrf-Token',
];
