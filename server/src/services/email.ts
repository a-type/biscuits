import { Email } from '@a-type/auth';
import { NodemailerEmailProvider } from '@a-type/auth-email-nodemailer';
import { assert } from '@a-type/utils';
import { UI_ORIGIN } from '../config/deployedContext.js';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
assert(EMAIL_USER, 'EMAIL_USER must be set');
assert(EMAIL_PASS, 'EMAIL_PASS must be set');

export const emailProvider = new NodemailerEmailProvider<{}>({
	async getConnectionInfo(ctx) {
		return {
			user: EMAIL_USER,
			pass: EMAIL_PASS,
			uiOrigin: UI_ORIGIN,
			appName: 'Biscuits',
			emailHost: 'smtp.zoho.com',
			developerName: 'Grant',
		};
	},
});

export const email = new Email<{}>({
	async getConfig(ctx) {
		return {
			uiOrigin: UI_ORIGIN,
			from: EMAIL_USER,
			appName: 'Biscuits',
			developerName: 'Grant',
		};
	},
	provider: emailProvider,
});
