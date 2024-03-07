import { appIds, apps } from '@biscuits/apps';
import { UI_ORIGIN } from './deployedContext.js';

export const ALLOWED_ORIGINS = [
  'http://localhost:6123',
  UI_ORIGIN,
  // old apps - allowed for transfer purposes
  'https://gnocchi.club',
  'https://www.gnocchi.club',
  'https://packing-list.gfor.rest',
  // including localhost versions
  'http://localhost:4444',
  // app origins
  ...appIds.map((id) => `https://${id}.${UI_ORIGIN}`),
  ...apps.map((app) => app.devOriginOverride),
];
