import { AppId } from '@biscuits/apps';
import {
	ChangelogItem,
	DomainRoute,
	Food,
	FoodCategory,
	Plan,
	PlanInvitation,
	PublishedRecipe,
	PublishedWishlist,
	User,
	WishlistIdeaRequest,
	WishlistIdeaRequestResponse,
	WishlistPurchase,
} from '@biscuits/db';
import { BiscuitsError } from '@biscuits/error';
import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { ExtractorData as GnocchiRecipeScan } from '@gnocchi.biscuits/scanning';
import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import RelayPlugin from '@pothos/plugin-relay';
import AuthPlugin from '@pothos/plugin-scope-auth';
import { LibraryInfo } from '@verdant-web/server';
import { ExtractorData as WishWashStorePageScan } from '@wish-wash.biscuits/scanning';
import {
	AutocompleteSuggestion,
	PlaceLocationDetails,
} from '../services/maps.js';
import {
	WeatherForecast,
	WeatherForecastDay,
	WeatherForecastInput,
} from '../services/weather.js';
import { GQLContext } from './context.js';
import {
	PublicRecipeData,
	PublicRecipeIngredient,
	PublicWishlistData,
	PublicWishlistItem,
} from './otherTypes.js';

export const builder = new SchemaBuilder<{
	Context: GQLContext;
	Objects: {
		User: User & { __typename: 'User' };
		Plan: Plan & { __typename: 'Plan' };
		PlanInvitation: PlanInvitation & { __typename: 'PlanInvitation' };
		PlanLibraryInfo: LibraryInfo & { id: string };
		PlanLibraryReplica: LibraryInfo['replicas'][number];
		PlanLibraryReplicaProfile: BiscuitsVerdantProfile;
		ClaimPlanInvitationResult: {
			userId: string;
			planId: string;
		};
		SetupPlanResult: {
			userId: string;
			planId: string;
		};
		StripeCheckoutData: {
			subscriptionId: string;
			clientSecret: string;
			mode: 'payment' | 'setup';
		};
		ProductInfo: {
			lookupKey: string;
		};
		CancelPlanResult: {};
		KickMemberResult: { planId: string };
		LeavePlanResult: {};
		CreatePlanInvitationResult: { planId: string; planInvitationId: string };
		CancelPlanInvitationResult: { planId: string };
		ResetSyncResult: { planId: string };
		ChangelogItem: ChangelogItem & { __typename: 'ChangelogItem' };
		SetUserPreferenceResult: { userId: string; key: string };
		UserPreference: { userId: string; key: string; value: any };
		DomainRoute: DomainRoute & { __typename: 'DomainRoute' };
		CreateDomainRouteResult: {
			domainRoute: DomainRoute & { __typename: 'DomainRoute' };
		};
		DnsRecord: {
			type: string;
			name: string;
			value: string;
		};

		// Gnocchi
		Food: Food & { __typename: 'Food' };
		FoodCategory: FoodCategory & { __typename: 'FoodCategory' };
		AssignFoodCategoryResult: { foodId: string };
		CreateCategoryResult: { categoryId: string };
		UpdateCategoryResult: { categoryId: string };
		DeleteCategoryResult: { categoryId: string };
		RecipeScan: GnocchiRecipeScan;
		RecipeScanResult: {
			type: 'web';
			data: GnocchiRecipeScan;
		};
		RecipeScanDetailedIngredient: NonNullable<
			GnocchiRecipeScan['detailedIngredients']
		>[number];
		RecipeScanDetailedStep: NonNullable<
			GnocchiRecipeScan['detailedSteps']
		>[number];
		PublishedRecipe: PublishedRecipe & { __typename: 'PublishedRecipe' };
		PublicRecipe: PublicRecipeData & { __typename: 'PublicRecipe' };
		PublicRecipeIngredient: PublicRecipeIngredient & {
			__typename: 'PublicRecipeIngredient';
		};
		PublicRecipePublisher: { fullName: string };

		// WishWash
		PublishedWishlist: PublishedWishlist & { __typename: 'PublishedWishlist' };
		StorePageScan: WishWashStorePageScan & { __typename: 'StorePageScan' };
		WishlistPurchase: WishlistPurchase & { __typename: 'WishlistPurchase' };
		WishlistIdeaRequest: WishlistIdeaRequest & {
			__typename: 'WishlistIdeaRequest';
		};
		PublicWishlist: PublicWishlistData & {
			__typename: 'PublicWishlist';
		};
		PublicWishlistItem: PublicWishlistItem & {
			__typename: 'PublicWishlistItem';
		};

		// Common Utils
		WeatherForecast: WeatherForecast;
		WeatherForecastDay: WeatherForecastDay;
		GeographicResult: PlaceLocationDetails;
		LocationAutocompleteSuggestion: AutocompleteSuggestion;
	};
	AuthScopes: {
		public: boolean;
		user: boolean;
		planAdmin: boolean;
		productAdmin: boolean;
		member: boolean;
		app: AppId;
		freeLimited: [string, number, UsageLimitPeriod];
	};
	Scalars: {
		DateTime: {
			Input: Date;
			Output: Date | string;
		};
		Date: {
			Input: string;
			Output: string;
		};
		JSON: {
			Input: unknown;
			Output: unknown;
		};
		ID: {
			Input: string;
			Output: string;
		};
	};
	Inputs: {
		SetupPlanInput: {
			priceLookupKey: string;
		};
		CreatePlanInvitationInput: {
			email: string;
		};
		CreatePushSubscriptionInput: {
			endpoint: string;
			p256dh: string;
			auth: string;
			appId: string;
		};
		CreateChangelogItemInput: {
			title: string;
			details: string;
			imageUrl?: string | null;
			important?: boolean | null;
			appId: string;
		};
		SetUserPreferenceInput: {
			key: string;
			value: any;
		};
		UpdateUserInfoInput: { name?: string | null };
		CreateDomainRouteInput: {
			appId: string;
			resourceId: string;
			domain: string;
		};
		GetDomainRouteByAppInput: {
			appId: string;
			resourceId: string;
		};

		// Gnocchi
		AssignFoodCategoryInput: {
			foodName: string;
			categoryId: string | number;
		};
		CreateCategoryInput: {
			name: string;
			sortKey: string;
		};
		UpdateCategoryInput: {
			id: string | number;
			name: string | null;
			sortKey: string | null;
		};
		RecipeScanInput: {
			url: string;
		};
		PublishRecipeInput: {
			id: string;
			slug: string;
		};

		// WishWash
		PublishWishlistInput: {
			id: string;
		};
		StorePageScanInput: {
			url: string;
		};
		PurchasePublicItemInput: {
			wishlistSlug: string;
			itemId: string;
			name: string;
			quantity: number;
		};
		WishlistIdeaRequestCreateInput: {
			wishlistId: string;
			name: string;
		};
		WishlistIdeaRequestResponseInput: {
			ideaRequestId: string;
			responses: WishlistIdeaRequestResponse;
		};

		// Common Utils
		WeatherForecastInput: WeatherForecastInput;
	};
	DefaultEdgesNullability: false;
}>({
	plugins: [RelayPlugin, DataloaderPlugin, AuthPlugin],
	relayOptions: {
		edgesFieldOptions: {
			nullable: false,
		},
	},
	authScopes: async (context) => {
		const member =
			!!context.session?.planId &&
			// mild back-compat for sessions without this flag
			(context.session.planHasSubscription === undefined ||
				!!context.session.planHasSubscription);
		return {
			public: async () => {
				return true;
			},
			user: !!context.session,
			member,
			planAdmin: context.session?.role === 'admin',
			productAdmin: !!context.session?.isProductAdmin,
			app: (appId) => {
				return (
					!!context.session &&
					(!context.session?.allowedApp ||
						context.session.allowedApp === '*' ||
						context.session.allowedApp === appId)
				);
			},
			freeLimited: async ([limitType, limitCount, limitPeriod]) => {
				if (!context.session) {
					return false;
				}
				if (context.session.planId) {
					// plan users are not limited
					return true;
				}
				// logged in but not in a plan -- subject to limits
				const limit = await context.db
					.selectFrom('UserUsageLimit')
					.selectAll()
					.where('userId', '=', context.session.userId)
					.where('limitType', '=', limitType)
					.executeTakeFirst();
				if (!limit) {
					// initialize limit
					await context.db
						.insertInto('UserUsageLimit')
						.values({
							userId: context.session.userId,
							limitType,
							uses: 1,
							resetsAt: addLimitPeriod(new Date(), limitPeriod),
						})
						.execute();
					return true;
				}

				// check limit
				if (limit.uses >= limitCount) {
					// might be expired?
					if (new Date(limit.resetsAt) < new Date()) {
						await context.db
							.updateTable('UserUsageLimit')
							.set({
								uses: 1,
								resetsAt: addLimitPeriod(new Date(limit.resetsAt), limitPeriod),
							})
							.where('userId', '=', context.session.userId)
							.where('limitType', '=', limitType)
							.execute();
						return true;
					}
					throw new BiscuitsError(
						BiscuitsError.Code.UsageLimitReached,
						'Free usage limit reached. Please try again later.',
						undefined,
						{
							resetsAt: new Date(limit.resetsAt).getTime(),
						},
					);
				}

				// increment uses
				await context.db
					.updateTable('UserUsageLimit')
					.set({ uses: limit.uses + 1 })
					.where('userId', '=', context.session.userId)
					.where('limitType', '=', limitType)
					.execute();

				return true;
			},
		};
	},
	scopeAuthOptions: {
		unauthorizedError: (_, _ctx, _info, _result) => {
			return new BiscuitsError(
				BiscuitsError.Code.Forbidden,
				'You do not have access to this feature',
			);
		},
	},
});

type UsageLimitPeriod = 'day' | 'week' | 'month' | 'year';
function addLimitPeriod(expired: Date, period: UsageLimitPeriod): Date {
	const reset = new Date(expired);
	switch (period) {
		case 'day':
			reset.setDate(reset.getDate() + 1);
			break;
		case 'week':
			reset.setDate(reset.getDate() + 7);
			break;
		case 'month':
			reset.setMonth(reset.getMonth() + 1);
			break;
		case 'year':
			reset.setFullYear(reset.getFullYear() + 1);
			break;
		default:
			throw new Error('Invalid period');
	}
	return reset;
}
