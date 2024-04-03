import { appIds, apps } from '@biscuits/apps';
import { UI_ORIGIN } from './deployedContext.js';
import { URL } from 'url';

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
  'http://localhost:4444',
  // app origins
  ...apps.map((app) => app.url),
  ...apps.map((app) => app.devOriginOverride),
];
