import { Email } from '@a-type/auth';
import { SesEmailProvider } from '@a-type/auth-email-ses';

export const email = new Email<{ env: Env }>({
	provider: new SesEmailProvider({
		async getConnectionInfo(ctx) {
			return {
				accessKeyId: ctx.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: ctx.env.AWS_SECRET_ACCESS_KEY,
				region: 'us-east-1',
			};
		},
	}),

	async getConfig(ctx) {
		return {
			from: ctx.env.EMAIL_FROM,
			uiOrigin: ctx.env.UI_ORIGIN,
			appName: 'Biscuits',
			developerName: 'Grant',
		};
	},
});
