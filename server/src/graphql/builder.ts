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
  User,
} from '@biscuits/db';
import { LibraryInfo } from '@verdant-web/server';
import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { ExtractorData } from '@gnocchi.biscuits/scanning';
import { BiscuitsError } from '@biscuits/error';

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

    // Gnocchi
    Food: Food & { __typename: 'Food' };
    FoodCategory: FoodCategory & { __typename: 'FoodCategory' };
    AssignFoodCategoryResult: { foodId: string };
    CreateCategoryResult: { categoryId: string };
    UpdateCategoryResult: { categoryId: string };
    DeleteCategoryResult: { categoryId: string };
    RecipeScan: ExtractorData;
    RecipeScanResult: {
      type: 'web';
      data: ExtractorData;
    };
    RecipeScanDetailedIngredient: NonNullable<
      ExtractorData['detailedIngredients']
    >[number];
    RecipeScanDetailedStep: NonNullable<ExtractorData['detailedSteps']>[number];
  };
  AuthScopes: {
    public: boolean;
    user: boolean;
    planAdmin: boolean;
    productAdmin: boolean;
    member: boolean;
  };
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
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
  };
}>({
  plugins: [RelayPlugin, DataloaderPlugin, AuthPlugin],
  relayOptions: {},
  authScopes: async (context) => ({
    public: true,
    user: !!context.session,
    member: !!context.session?.planId,
    planAdmin: context.session?.role === 'admin',
    productAdmin: !!context.session?.isProductAdmin,
  }),
  scopeAuthOptions: {
    unauthorizedError: (_, ctx, info, result) => {
      return new BiscuitsError(BiscuitsError.Code.Forbidden);
    },
  },
});
