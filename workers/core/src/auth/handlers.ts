import { GoogleProvider, createHandlers, honoAdapter } from '@a-type/auth';
import { BiscuitsError } from '@biscuits/error';
import { Context } from 'hono';
import { sessions } from '../auth/session.js';
import { HonoEnv } from '../config/hono.js';
import {
	comparePassword,
	createDb,
	hashPassword,
	id,
} from '../services/db/index.js';
import { email } from '../services/email.js';

export const authHandlers = createHandlers<Context<HonoEnv>>({
	sessions,
	getRedirectConfig(ctx) {
		return {
			defaultReturnToOrigin: ctx.env.UI_ORIGIN,
			allowedReturnToOrigin: (origin: string) => {
				if (origin === ctx.env.UI_ORIGIN) return true;
				const asUrl = new URL(origin);
				return (
					asUrl.hostname === 'localhost' ||
					asUrl.hostname.endsWith('biscuits.club')
				);
			},
		};
	},
	providers: {
		google: new GoogleProvider({
			getConfig(ctx) {
				return {
					clientId: ctx.env.GOOGLE_AUTH_CLIENT_ID,
					clientSecret: ctx.env.GOOGLE_AUTH_CLIENT_SECRET,
					redirectUri:
						ctx.env.DEPLOYED_ORIGIN + '/auth/provider/google/callback',
				};
			},
		}),
	},
	adapter: honoAdapter,
	addProvidersToExistingUsers: true,
	defaultReturnToPath: '/',
	email,
	getStorage: (ctx) => {
		const db = createDb(ctx.env.CORE_DB);
		return {
			getAccountByProviderAccountId: async (
				providerName,
				providerAccountId,
			) => {
				const dbAccount = await db
					.selectFrom('Account')
					.where('provider', '=', providerName)
					.where('providerAccountId', '=', providerAccountId)
					.selectAll()
					.executeTakeFirst();

				if (!dbAccount) {
					return undefined;
				}

				return {
					...dbAccount,
					expiresAt:
						dbAccount.accessTokenExpiresAt ?
							new Date(dbAccount.accessTokenExpiresAt)
						:	null,
				};
			},
			getUserByEmail: async (email) => {
				return db
					.selectFrom('User')
					.where('email', '=', email)
					.selectAll()
					.executeTakeFirst();
			},
			insertAccount: async ({ expiresAt, ...account }) => {
				return db
					.insertInto('Account')
					.values({
						id: id(),
						accessTokenExpiresAt: expiresAt ? new Date(expiresAt) : undefined,

						...account,
					})
					.returning('id')
					.executeTakeFirstOrThrow();
			},
			insertUser: async ({
				plaintextPassword,
				fullName,
				friendlyName,
				...user
			}) => {
				const password =
					plaintextPassword ? await hashPassword(plaintextPassword) : undefined;
				const result = await db.transaction().execute(async (tx) => {
					const planResult = await tx
						.insertInto('Plan')
						.values({
							id: id(),
							name: `${fullName ?? 'Anonymous'}'s Plan`,
							subscriptionStatus: 'none',
							memberLimit: 1,
							featureFlags: {},
						})
						.returning('id')
						.executeTakeFirstOrThrow(
							() =>
								new BiscuitsError(
									BiscuitsError.Code.Unexpected,
									'Failed to create plan',
								),
						);
					const userResult = await tx
						.insertInto('User')
						.values({
							id: id(),
							password,
							fullName: fullName || 'Anonymous',
							friendlyName: friendlyName || fullName || 'Anonymous',
							isProductAdmin: false,
							acceptedTosAt: new Date(),
							planId: planResult.id,
							planRole: 'admin',
							...user,
							emailVerifiedAt: user.emailVerifiedAt?.toUTCString() ?? undefined,
						})
						.returning('id')
						.executeTakeFirstOrThrow();

					return userResult;
				});
				email
					.sendCustomEmail(
						{
							to: 'hi@biscuits.club',
							subject: 'New Biscuits User',
							text: `A new user has signed up: ${user.email}`,
							html: `<p>A new user has signed up: ${user.email}</p>`,
						},
						ctx,
					)
					.catch((error) => {
						console.error('Failed to send new user email', error);
					});
				return result;
			},
			insertVerificationCode: async ({ expiresAt, ...verificationCode }) => {
				await db
					.insertInto('VerificationCode')
					.values({
						id: id(),
						expiresAt: new Date(expiresAt),
						...verificationCode,
					})
					.returning('id')
					.executeTakeFirstOrThrow();
			},
			getVerificationCode: async (email, code) => {
				const value = await db
					.selectFrom('VerificationCode')
					.where('code', '=', code)
					.where('email', '=', email)
					.selectAll()
					.executeTakeFirst();

				if (!value) {
					return undefined;
				}

				return value;
			},
			consumeVerificationCode: async (id) => {
				await db.deleteFrom('VerificationCode').where('id', '=', id).execute();
			},
			getUserByEmailAndPassword: async (email, plaintextPassword) => {
				const user = await db
					.selectFrom('User')
					.where('email', '=', email)
					.selectAll()
					.executeTakeFirst();

				if (!user?.password) {
					return undefined;
				}

				if (!(await comparePassword(plaintextPassword, user.password))) {
					return undefined;
				}

				return user;
			},
			updateUser: async (id, { plaintextPassword, ...user }) => {
				const password =
					plaintextPassword ? await hashPassword(plaintextPassword) : undefined;
				await db
					.updateTable('User')
					.where('id', '=', id)
					.set({
						fullName: user.fullName ?? undefined,
						emailVerifiedAt: user.emailVerifiedAt?.toUTCString() ?? undefined,
						friendlyName: user.friendlyName ?? undefined,
						imageUrl: user.imageUrl ?? undefined,
						password,
					})
					.executeTakeFirstOrThrow();
			},
		};
	},
});
