import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import AuthPlugin from '@pothos/plugin-scope-auth';
import { GQLContext } from './context.js';
import {
  ChangelogItem,
  Food,
  FoodCategory,
  Plan,
  PlanInvitation,
  PublishedRecipe,
  PublishedWishlist,
  User,
} from '@biscuits/db';
import { LibraryInfo } from '@verdant-web/server';
import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { ExtractorData as GnocchiRecipeScan } from '@gnocchi.biscuits/scanning';
import { BiscuitsError } from '@biscuits/error';
import {
  GeographicResult,
  TemperatureUnit,
  WeatherForecast,
  WeatherForecastDay,
  WeatherForecastInput,
} from '../services/weather.js';
import {
  AutocompleteSuggestion,
  PlaceLocationDetails,
} from '../services/maps.js';
import { ExtractorData as WishWashStorePageScan } from '@wish-wash.biscuits/scanning';
import { AppId } from '@biscuits/apps';

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
    };
    ProductInfo: {
      lookupKey: string;
    };
    CancelPlanResult: {};
    KickMemberResult: { planId: string };
    CreatePlanInvitationResult: { planId: string; planInvitationId: string };
    CancelPlanInvitationResult: { planId: string };
    ResetSyncResult: { planId: string };
    ChangelogItem: ChangelogItem & { __typename: 'ChangelogItem' };
    SetUserPreferenceResult: { userId: string; key: string };
    UserPreference: { userId: string; key: string; value: any };

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

    // WishWash
    PublishedWishlist: PublishedWishlist & { __typename: 'PublishedWishlist' };
    StorePageScan: WishWashStorePageScan & { __typename: 'StorePageScan' };

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
  };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
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
    const member = !!context.session?.planId;
    return {
      public: true,
      user: !!context.session,
      member,
      planAdmin: context.session?.role === 'admin',
      productAdmin: !!context.session?.isProductAdmin,
      app: (appId) =>
        member &&
        (!context.session?.allowedApp || context.session.allowedApp === appId),
    };
  },
  scopeAuthOptions: {
    unauthorizedError: (_, ctx, info, result) => {
      return new BiscuitsError(BiscuitsError.Code.Forbidden);
    },
  },
});
