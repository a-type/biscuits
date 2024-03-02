import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import AuthPlugin from '@pothos/plugin-scope-auth';
import { GQLContext } from './context.js';
import { ChangelogItem, Plan, PlanInvitation, User } from '@biscuits/db';
import { VerdantLibraryInfo } from '../verdant/verdant.js';
import { BiscuitsVerdantProfile } from '@biscuits/libraries';

export const builder = new SchemaBuilder<{
  Context: GQLContext;
  Objects: {
    User: User & { __typename: 'User' };
    Plan: Plan & { __typename: 'Plan' };
    PlanInvitation: PlanInvitation & { __typename: 'PlanInvitation' };
    PlanLibraryInfo: VerdantLibraryInfo & { id: string };
    PlanLibraryReplica: VerdantLibraryInfo['replicas'][number];
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
      priceId: string;
    };
    CancelPlanResult: {};
    KickMemberResult: { planId: string };
    CreatePlanInvitationResult: { planId: string; planInvitationId: string };
    CancelPlanInvitationResult: { planId: string };
    ResetSyncResult: { planId: string };
    ChangelogItem: ChangelogItem & { __typename: 'ChangelogItem' };
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
  };
  Inputs: {
    SetupPlanInput: {
      stripePriceId: string;
    };
    CreatePlanInvitationInput: {
      email: string;
    };
    CreatePushSubscriptionInput: {
      endpoint: string;
      p256dh: string;
      auth: string;
    };
    CreateChangelogItemInput: {
      title: string;
      details: string;
      imageUrl?: string | null;
      important?: boolean | null;
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
  scopeAuthOptions: {},
});
