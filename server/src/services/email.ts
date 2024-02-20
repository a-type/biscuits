import { Email } from '@a-type/auth';
import { UI_ORIGIN } from '../config/deployedContext.js';
import { assert } from '@a-type/utils';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
assert(EMAIL_USER, 'EMAIL_USER must be set');
assert(EMAIL_PASS, 'EMAIL_PASS must be set');

export const email = new Email({
  user: EMAIL_USER,
  pass: EMAIL_PASS,
  uiOrigin: UI_ORIGIN,
  appName: 'Biscuits',
  emailHost: 'smtp.zoho.com',
  developerName: 'Grant',
});
