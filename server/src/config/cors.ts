import { appIds } from '@biscuits/apps';
import { UI_ORIGIN } from './deployedContext.js';

export const ALLOWED_ORIGINS = [
  'http://localhost:6123',
  UI_ORIGIN,
  'https://aglio.gfor.rest',
  'https://aglio.app',
  'https://www.aglio.app',
  'https://gnocchi.club',
  'https://www.gnocchi.club',
  'https://packing-list.gfor.rest',
  // app origins
  ...appIds.map((id) => `https://${id}.${UI_ORIGIN}`),
  // dev app origins are handled in middleware
];
