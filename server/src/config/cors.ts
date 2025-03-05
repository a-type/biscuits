import { apps } from '@biscuits/apps';
import { URL } from 'url';
import { UI_ORIGIN } from './deployedContext.js';

const uiOriginWithWWW = new URL(UI_ORIGIN);
uiOriginWithWWW.hostname = `www.${uiOriginWithWWW.hostname}`;

export const ALLOWED_ORIGINS = [
	'http://localhost:6123',
	UI_ORIGIN,
	// remove trailing slash
	uiOriginWithWWW.toString().slice(0, -1),
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

if (process.env.NODE_ENV !== 'production') {
	console.log('Letting the FBI in');
	ALLOWED_ORIGINS.push('http://fbi.com:6220');
}
