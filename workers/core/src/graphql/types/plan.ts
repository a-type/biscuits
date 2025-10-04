import { Session } from '@a-type/auth';
import { assert } from '@a-type/utils';
import { getLibraryName } from '@biscuits/libraries';
import { isSubscribed } from '../../auth/subscription.js';
import { BiscuitsError } from '../../error.js';
import { logger } from '../../logger.js';
import {
	PlanVitalInfo,
	canPlanAcceptAMember,
	cancelPlanSubscription,
	removeUserFromPlan,
	setupNewPlan,
	updatePlanSubscription,
} from '../../management/plans.js';
import { cacheSubscriptionInfoOnPlan } from '../../management/subscription.js';
import { Plan as DBPlan } from '../../services/db/index.js';
import { email } from '../../services/email.js';
import { builder } from '../builder.js';
import { createResults, keyIndexes } from '../dataloaders/index.js';
import { assignTypeName, hasTypeName } from '../relay.js';
import { User } from './user.js';

builder.queryFields((t) => ({
	plan: t.field({
		type: Plan,
		nullable: true,
		resolve: async (_, __, ctx) => {
			if (ctx.session?.planId) {
				return ctx.session.planId;
			}
			return null;
		},
	}),
	plans: t.connection({
		type: Plan,
		authScopes: {
			productAdmin: true,
		},
		resolve: async (_, { first, last, before, after }, ctx) => {
			let builder = ctx.db.selectFrom('Plan').selectAll('Plan');

			if (first || last) {
				const limit = (first ?? last ?? 0) + 1;
				builder = builder.limit(limit);
			}
			// cursor is ID
			if (before) {
				builder = builder.where('id', '<', before);
			}
			if (after) {
				builder = builder.where('id', '>', after);
			}

			const rawNodes = await builder.execute();
			const nodes = rawNodes
				.slice(0, first ?? last ?? 0)
				.map(assignTypeName('Plan'));

			return {
				// slice down to limit again
				edges: nodes.map((node) => ({
					cursor: node.id,
					node,
				})),
				pageInfo: {
					hasNextPage: rawNodes.length > nodes.length,
					hasPreviousPage: !!before,
					startCursor: nodes[0]?.id ?? null,
					endCursor: nodes[nodes.length - 1]?.id ?? null,
				},
			};
		},
	}),
}));

builder.mutationFields((t) => ({
	setupPlan: t.field({
		authScopes: {
			user: true,
		},
		type: 'SetupPlanResult',
		args: {
			input: t.arg({
				type: 'SetupPlanInput',
				required: true,
			}),
		},
		resolve: async (_, { input }, ctx) => {
			if (!ctx.session) {
				throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
			}
			const userId = ctx.session.userId;

			const userDetails = await ctx.db
				.selectFrom('User')
				.select(['id', 'email', 'planId', 'fullName', 'stripeCustomerId'])
				.where('id', '=', userId)
				.executeTakeFirst();

			if (!userDetails) {
				throw new BiscuitsError(
					BiscuitsError.Code.Unexpected,
					'User not found',
				);
			}

			let planId;
			let plan: PlanVitalInfo | undefined;
			if (userDetails?.planId) {
				// if existing plan has a subscription, change it
				// to use the new product. if not, just update the plan
				plan = await updatePlanSubscription({
					userDetails,
					priceLookupKey: input.priceLookupKey,
					ctx,
				});
				planId = plan.id;
			} else {
				plan = await setupNewPlan({
					userDetails,
					priceLookupKey: input.priceLookupKey,
					ctx,
				});
				planId = plan.id;
			}

			assert(!!planId, 'Plan ID not set during setupPlan');

			const newSession: Session = {
				...ctx.session,
				role: 'admin' as const,
				planId,
				allowedApp: plan.allowedApp || undefined,
			};
			await ctx.auth.setLoginSession(newSession);

			return { planId, userId };
		},
	}),
	deletePlan: t.field({
		args: {
			id: t.arg.id(),
		},
		type: 'Plan',
		authScopes: {
			productAdmin: true,
		},
		resolve: async (_, { id }, ctx) => {
			if (!ctx.session) {
				throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
			}
			const userId = ctx.session.userId;

			await cancelPlanSubscription(`${id}`, userId, ctx);
			const plan = await ctx.db
				.deleteFrom('Plan')
				.where('id', '=', `${id}`)
				.returningAll()
				.executeTakeFirst();

			if (!plan) {
				throw new Error('Plan not found');
			}

			return assignTypeName('Plan')(plan);
		},
	}),
	cancelPlan: t.field({
		authScopes: {
			planAdmin: true,
		},
		type: 'CancelPlanResult',
		resolve: async (_, __, ctx) => {
			if (!ctx.session) {
				throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
			}
			const userId = ctx.session.userId;

			if (!ctx.session.planId) {
				throw new BiscuitsError(BiscuitsError.Code.NoPlan);
			}

			await cancelPlanSubscription(ctx.session.planId, userId, ctx);

			return {};
		},
	}),
	kickMember: t.field({
		type: 'KickMemberResult',
		authScopes: {
			planAdmin: true,
		},
		args: {
			userId: t.arg.globalID({
				required: true,
			}),
		},
		resolve: async (_, { userId: { id } }, ctx) => {
			const planId = ctx.session?.planId;
			if (!planId) {
				throw new BiscuitsError(BiscuitsError.Code.NoPlan);
			}
			const removed = await removeUserFromPlan(planId, id, ctx);
			if (removed) {
				await email.sendCustomEmail(
					{
						to: removed.email,
						subject: 'You have been removed from your Biscuits plan',
						text: `You have been removed from the Biscuits plan by an admin. If you believe this is a mistake, please contact support (https://biscuits.club/contact).`,
						html: `You have been removed from the Biscuits plan by an admin. If you believe this is a mistake, please <a href="https://biscuits.club/contact">contact support.</a>`,
					},
					ctx.reqCtx,
				);
			}
			return { planId };
		},
	}),
	leavePlan: t.field({
		type: 'LeavePlanResult',
		authScopes: {
			member: true,
		},
		resolve: async (_, __, ctx) => {
			const planId = ctx.session?.planId;
			if (!planId) {
				throw new BiscuitsError(
					BiscuitsError.Code.BadRequest,
					'User is not in a plan',
				);
			}
			assert(ctx.session);

			const removed = await removeUserFromPlan(planId, ctx.session.userId, ctx);
			if (removed) {
				await email.sendCustomEmail(
					{
						to: removed.email,
						subject: 'You have left your Biscuits plan',
						text: `You have left the Biscuits plan. If you believe this is a mistake, ask your plan admin for another invite.`,
						html: `You have left the Biscuits plan. If you believe this is a mistake, ask your plan admin for another invite.`,
					},
					ctx.reqCtx,
				);
			} else {
				const user = await ctx.db
					.selectFrom('User')
					.select(['email', 'fullName'])
					.where('id', '=', ctx.session.userId)
					.executeTakeFirst();
				if (user) {
					// this means the plan was cancelled.
					await email.sendCustomEmail(
						{
							to: user.email,
							subject: 'Your Biscuits plan has been closed',
							text: `Your Biscuits plan has been closed. If you believe this is a mistake, please contact support (https://biscuits.club/contact).`,
							html: `Your Biscuits plan has been closed. If you believe this is a mistake, please <a href="https://biscuits.club/contact">contact support.</a>`,
						},
						ctx.reqCtx,
					);
				}
			}

			// clear the session
			await ctx.auth.setLoginSession({
				...ctx.session,
				planId: null,
				role: 'user',
			});
			return {};
		},
	}),
	setFeatureFlag: t.field({
		type: 'Plan',
		authScopes: {
			productAdmin: true,
		},
		args: {
			planId: t.arg.globalID({
				required: true,
			}),
			flagName: t.arg({
				type: 'String',
				required: true,
			}),
			enabled: t.arg({
				type: 'Boolean',
				required: true,
			}),
		},
		resolve: async (_, { planId, flagName, enabled }, ctx) => {
			const { id } = planId;
			const currentPlan = await ctx.db
				.selectFrom('Plan')
				.select(['featureFlags'])
				.where('id', '=', id)
				.executeTakeFirst();

			if (!currentPlan) {
				throw new BiscuitsError(BiscuitsError.Code.NotFound);
			}

			const flags = currentPlan?.featureFlags ?? {};
			flags[flagName] = enabled;

			const plan = await ctx.db
				.updateTable('Plan')
				.set({
					featureFlags: flags,
				})
				.where('id', '=', id)
				.returningAll()
				.executeTakeFirst();

			if (!plan) {
				logger.urgent('Failed to update plan feature flags', {
					planId: id,
					featureFlags: flags,
				});
				throw new BiscuitsError(BiscuitsError.Code.Unexpected);
			}

			return assignTypeName('Plan')(plan);
		},
	}),
}));

export const Plan = builder.loadableNodeRef('Plan', {
	load: async (ids, ctx) => {
		// there's special auth logic here for loading plans for regular users -
		// a non-product-admin should never load anything but their own plan.

		// but there's one more thing... they might have been kicked from
		// their plan. so we need to validate their session planId with a real
		// planId in the database.

		// nobody without a session should be loading plans
		if (!ctx.session) {
			throw new BiscuitsError(BiscuitsError.Code.NotLoggedIn);
		}

		let plans: DBPlan[];

		if (ctx.session?.isProductAdmin) {
			// no worries, just load them
			plans = await ctx.db
				.selectFrom('Plan')
				.selectAll()
				.where('id', 'in', ids as string[])
				.execute();
		} else {
			// if the user is not a product admin, they can only load their own plan
			if (ids.length !== 1) {
				logger.warn(`Non-admin user tried to load multiple plans`, {
					userId: ctx.session.userId,
					planIds: ids,
				});
				throw new BiscuitsError(BiscuitsError.Code.Unexpected);
			}
			const planId = ctx.session.planId;
			if (!planId) {
				logger.warn(`Plan not found, ${planId}`);
				return createResults<DBPlan & { __typename: 'Plan' }>(ids);
			}

			// find plan by user ID, not session plan ID
			const myPlan = await ctx.db
				.selectFrom('User')
				.innerJoin('Plan', 'Plan.id', 'User.planId')
				.selectAll('Plan')
				.where('User.id', '=', ctx.session.userId)
				.executeTakeFirst();

			if (!myPlan || myPlan.id !== planId) {
				// user session is not allowed access to this unrelated plan
				throw new BiscuitsError(BiscuitsError.Code.NotFound);
			}

			plans = [myPlan];
		}

		// map results to key indexes
		const indexes = keyIndexes(ids);
		const results = createResults<DBPlan & { __typename: 'Plan' }>(ids);
		for (const plan of plans) {
			results[indexes[plan.id]] = assignTypeName('Plan')(plan);
		}

		return results;
	},
	id: {
		resolve: (plan) => plan.id,
	},
});

Plan.implement({
	description: 'A group of users with a subscription to a product',
	isTypeOf: hasTypeName('Plan'),
	fields: (t) => ({
		subscriptionStatus: t.string({
			resolve: async (plan, _, ctx) => {
				if (!plan.stripeSubscriptionId) return 'inactive';
				if (plan.subscriptionStatus) return plan.subscriptionStatus;
				// we don't have cached data - fetch it
				const subscription = await ctx.stripe.subscriptions.retrieve(
					plan.stripeSubscriptionId,
				);
				await cacheSubscriptionInfoOnPlan(subscription, ctx);
				return subscription.status;
			},
		}),
		hasAppAccess: t.field({
			type: 'Boolean',
			args: {
				appId: t.arg({
					type: 'String',
					required: true,
				}),
			},
			resolve: async (plan, { appId }, ctx) => {
				// users always have access to Wish Wash
				// TODO: find a way to generalize / systemitize this behavior...
				if (appId === 'wish-wash') {
					return true;
				}

				return (
					isSubscribed(plan.subscriptionStatus) &&
					(!plan.allowedApp || plan.allowedApp === appId)
				);
			},
		}),
		isSubscribed: t.field({
			type: 'Boolean',
			resolve: (plan) => isSubscribed(plan.subscriptionStatus),
		}),
		subscriptionCanceledAt: t.expose('subscriptionCanceledAt', {
			nullable: true,
			type: 'DateTime',
		}),
		subscriptionExpiresAt: t.expose('subscriptionExpiresAt', {
			nullable: true,
			type: 'DateTime',
		}),
		productInfo: t.field({
			type: 'ProductInfo',
			nullable: true,
			resolve: async (plan, _, ctx) => {
				if (plan.stripePriceId) {
					// this is gross, but the shared cache on stripe loaders
					// should at least mean it's not awful.
					const price = await ctx.dataloaders.stripePriceIdLoader.load(
						plan.stripePriceId,
					);
					if (!price?.lookup_key) return null;
					return {
						lookupKey: price.lookup_key,
					};
				}
				return null;
			},
		}),
		checkoutData: t.field({
			type: 'StripeCheckoutData',
			authScopes: {
				user: true,
			},
			nullable: true,
			resolve: async (plan, _, ctx) => {
				// only admins can complete checkout
				if (ctx.session?.role !== 'admin') return null;
				if (!plan.stripeSubscriptionId) return null;
				// can only complete checkout if subscription is incomplete or
				// if we haven't yet synced with Stripe
				if (
					plan.subscriptionStatus !== 'incomplete' &&
					plan.subscriptionStatus !== 'trialing' &&
					plan.subscriptionStatus !== null
				) {
					logger.debug(
						'Subscription status is not incomplete or trialing. Cannot route to checkout.',
						{
							planId: plan.id,
							status: plan.subscriptionStatus,
						},
					);
					return null;
				}

				const subscription = await ctx.stripe.subscriptions.retrieve(
					plan.stripeSubscriptionId,
					{
						expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
					},
				);
				// double check
				if (
					subscription.status !== 'incomplete' &&
					subscription.status !== 'trialing'
				) {
					// changed since we last looked - let's store the new data.
					await cacheSubscriptionInfoOnPlan(subscription, ctx);
					return null;
				}

				if (subscription.status === 'incomplete') {
					assert(
						typeof subscription.latest_invoice !== 'string',
						'did not expand latest_invoice field',
					);
					assert(
						typeof subscription.latest_invoice?.payment_intent !== 'string',
						'did not expand latest_invoice.payment_intent field',
					);
					const clientSecret =
						subscription.latest_invoice?.payment_intent?.client_secret;

					if (!clientSecret) {
						logger.urgent('Stripe subscription does not have client secret', {
							subscriptionId: subscription.id,
							latestInvoice: subscription.latest_invoice,
							paymentIntent: subscription.latest_invoice?.payment_intent,
						});
						throw new BiscuitsError(
							BiscuitsError.Code.Unexpected,
							'Failed to begin the checkout process. This is unexpected. Please try again.',
						);
					}

					return {
						subscriptionId: subscription.id,
						clientSecret,
						mode: 'payment' as const,
					};
				} else if (subscription.status === 'trialing') {
					// provide checkout data for the setup intent
					assert(
						typeof subscription.pending_setup_intent !== 'string',
						'did not expand pending_setup_intent field',
					);
					if (!subscription.pending_setup_intent) {
						// might happen who knows
						return null;
					}
					const clientSecret = subscription.pending_setup_intent?.client_secret;
					if (!clientSecret) {
						logger.urgent('Stripe subscription does not have client secret', {
							subscriptionId: subscription.id,
							pendingSetupIntent: subscription.pending_setup_intent,
						});
						throw new BiscuitsError(
							BiscuitsError.Code.Unexpected,
							'Failed to begin the checkout process. This is unexpected. Please try again.',
						);
					}

					return {
						subscriptionId: subscription.id,
						clientSecret,
						mode: 'setup' as const,
					};
				}
			},
		}),
		members: t.field({
			type: [User],
			nullable: false,
			resolve: async (plan, _, ctx) => {
				const users = await ctx.db
					.selectFrom('User')
					.select('id')
					.where('planId', '=', plan.id)
					.execute();
				return users.map(({ id }) => id);
			},
		}),
		libraryInfo: t.field({
			type: 'PlanLibraryInfo',
			authScopes: {
				user: true,
			},
			nullable: true,
			args: {
				app: t.arg({
					type: 'String',
					required: true,
					description: 'The app to get library info for',
				}),
				access: t.arg({
					type: 'String',
					required: true,
					description: 'The access level of the library',
				}),
			},
			resolve: async (plan, { app, access }, ctx) => {
				assert(ctx.session?.userId);
				if (access !== 'members' && access !== 'user') {
					throw new BiscuitsError(
						BiscuitsError.Code.BadRequest,
						'Invalid access type',
					);
				}
				const libraryName = getLibraryName({
					planId: plan.id,
					app,
					access,
					userId: ctx.session.userId,
				});
				const library =
					await ctx.reqCtx.env.VERDANT_LIBRARY.getByName(libraryName);
				if (!library) {
					return null;
				}
				if (!(await library.isInitialized())) {
					return null;
				}
				const info = await library.getInfo();
				if (
					!info ||
					(info.baselinesCount === 0 && info.operationsCount === 0)
				) {
					return null;
				}
				return info;
			},
		}),
		pendingInvitations: t.field({
			type: ['PlanInvitation'],
			authScopes: {
				user: true,
			},
			resolve: async (plan, _, ctx) => {
				// only admins can see pending invitations
				if (ctx.session?.role !== 'admin') return [];

				const result = await ctx.db
					.selectFrom('PlanInvitation')
					.selectAll()
					.where('planId', '=', plan.id)
					.where('claimedAt', 'is', null)
					.execute();

				return result.map(assignTypeName('PlanInvitation'));
			},
		}),
		canInviteMore: t.field({
			type: 'Boolean',
			resolve: async (plan, _, ctx) => {
				return (await canPlanAcceptAMember(plan.id, ctx)).ok;
			},
		}),
		featureFlags: t.field({
			type: ['String'],
			resolve: async (plan) => {
				if (typeof plan.featureFlags === 'string') {
					try {
						const planFlags = JSON.parse(plan.featureFlags ?? '{}');
						return Object.keys(planFlags).filter((key) => planFlags[key]);
					} catch (err) {
						logger.warn('Error parsing plan feature flags', {
							planId: plan.id,
							featureFlags: plan.featureFlags,
							error: err,
						});
						return [];
					}
				} else {
					const planFlags = plan.featureFlags ?? {};
					return Object.keys(planFlags).filter((key) => !!planFlags[key]);
				}
			},
		}),
		trialEndsAt: t.field({
			nullable: true,
			type: 'DateTime',
			resolve: async (plan, _, ctx) => {
				if (!plan.stripeSubscriptionId) return null;
				if (plan.subscriptionStatus === 'trialing') {
					const subscription = await ctx.stripe.subscriptions.retrieve(
						plan.stripeSubscriptionId,
					);
					if (subscription.status !== 'trialing') {
						logger.warn(
							'Subscription status changed while fetching trial end',
							{
								planId: plan.id,
								subscriptionId: plan.stripeSubscriptionId,
								oldStatus: plan.subscriptionStatus,
								newStatus: subscription.status,
							},
						);
						await cacheSubscriptionInfoOnPlan(subscription, ctx);
						return null;
					}
					return subscription.trial_end ?
							new Date(subscription.trial_end * 1000)
						:	null;
				}
				return null;
			},
		}),
		userIsAdmin: t.field({
			type: 'Boolean',
			resolve: (plan, _, ctx) => {
				return ctx.session?.planId === plan.id && ctx.session?.role === 'admin';
			},
		}),
	}),
});

builder.objectType('StripeCheckoutData', {
	fields: (t) => ({
		subscriptionId: t.exposeString('subscriptionId'),
		clientSecret: t.exposeString('clientSecret'),
		mode: t.exposeString('mode'),
	}),
});

builder.inputType('SetupPlanInput', {
	fields: (t) => ({
		priceLookupKey: t.string({
			required: true,
		}),
	}),
});

builder.objectType('SetupPlanResult', {
	fields: (t) => ({
		user: t.field({
			type: User,
			resolve: (result) => result.userId,
		}),
		plan: t.field({
			type: Plan,
			resolve: (result) => result.planId,
		}),
	}),
});

builder.objectType('CancelPlanResult', {
	fields: (t) => ({
		user: t.field({
			type: User,
			nullable: true,
			resolve: (_, __, ctx) => ctx.session?.userId ?? null,
		}),
	}),
});

builder.objectType('KickMemberResult', {
	fields: (t) => ({
		plan: t.field({
			type: Plan,
			resolve: (result) => result.planId,
		}),
	}),
});

builder.objectType('LeavePlanResult', {
	fields: (t) => ({
		me: t.field({
			type: User,
			resolve: (_, __, ctx) => {
				if (!ctx.session) {
					throw new BiscuitsError(BiscuitsError.Code.Unexpected);
				}
				return ctx.session.userId;
			},
		}),
	}),
});
