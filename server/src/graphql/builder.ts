import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import AuthPlugin from '@pothos/plugin-scope-auth';
import { GQLContext } from './context.js';
import { Plan, PlanInvitation, User } from '@biscuits/db';
import { VerdantLibraryInfo } from '../verdant/verdant.js';

export const builder = new SchemaBuilder<{
  Context: GQLContext;
  Objects: {
    User: User & { __typename: 'User' };
    Plan: Plan & { __typename: 'Plan' };
    PlanInvitation: PlanInvitation & { __typename: 'PlanInvitation' };
    PlanLibraryInfo: VerdantLibraryInfo;
    PlanLibraryReplica: VerdantLibraryInfo['replicas'][number];
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
      priceId: string;
    };
    CancelPlanResult: {};
  };
  AuthScopes: {
    public: boolean;
    user: boolean;
    planAdmin: boolean;
    productAdmin: boolean;
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
  };
  Inputs: {
    SetupPlanInput: {
      stripePriceId: string;
    };
    CreatePlanInvitationInput: {
      email: string;
    };
  };
}>({
  plugins: [RelayPlugin, DataloaderPlugin, AuthPlugin],
  relayOptions: {},
  authScopes: async (context) => ({
    public: true,
    user: !!context.session,
    planAdmin: context.session?.role === 'admin',
    productAdmin: !!context.session?.isProductAdmin,
  }),
  scopeAuthOptions: {},
});
