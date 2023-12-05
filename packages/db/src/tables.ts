import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface Database {
  Profile: ProfileTable;
  Account: AccountTable;
  Plan: PlanTable;
  PlanInvitation: PlanInvitationTable;
  EmailVerification: EmailVerificationTable;
  PasswordReset: PasswordResetTable;
  ActivityLog: ActivityLogTable;
  // TODO:
  // pushSubscription: PushSubscriptionTable;
  // changelogItem: ChangelogItemTable;
}

export interface ProfileTable {
  id: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;

  fullName: string;
  friendlyName: string;
  email: string;
  imageUrl: string | null;

  password: string | null;
  isProductAdmin: boolean;

  planId: string | null;
  planRole: string | null;
}
export type Profile = Selectable<ProfileTable>;
export type NewProfile = Insertable<ProfileTable>;
export type ProfileUpdate = Updateable<ProfileTable>;

export interface AccountTable {
  id: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;

  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken: string | null;
  accessToken: string | null;
  tokenType: string | null;
  accessTokenExpiresAt: ColumnType<Date, string | undefined, string> | null;
  profileId: string;
}

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;

export interface PlanTable {
  id: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;

  name: string;
  stripeProductId: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  subscriptionStatus: string | null;
  subscriptionStatusCheckedAt: ColumnType<
    Date,
    string | undefined,
    string
  > | null;
  subscriptionExpiresAt: ColumnType<Date, string | undefined, string> | null;
  subscriptionCanceledAt: ColumnType<Date, string | undefined, string> | null;
  featureFlags: string;
}

export type Plan = Selectable<PlanTable>;
export type NewPlan = Insertable<PlanTable>;
export type PlanUpdate = Updateable<PlanTable>;

export interface PlanInvitationTable {
  id: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;

  planId: string;
  inviterId: string;
  inviterName: string;
  expiresAt: ColumnType<Date, string | undefined, string> | null;
  claimedAt: ColumnType<Date, string | undefined, string> | null;
}

export type PlanInvitation = Selectable<PlanInvitationTable>;
export type NewPlanInvitation = Insertable<PlanInvitationTable>;
export type PlanInvitationUpdate = Updateable<PlanInvitationTable>;

export interface EmailVerificationTable {
  id: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;

  code: string;
  email: string;
  name: string;
  expiresAt: ColumnType<Date, string | undefined, string>;
}

export type EmailVerification = Selectable<EmailVerificationTable>;
export type NewEmailVerification = Insertable<EmailVerificationTable>;
export type EmailVerificationUpdate = Updateable<EmailVerificationTable>;

export interface PasswordResetTable {
  id: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;

  code: string;
  email: string;
  name: string;
  expiresAt: ColumnType<Date, string | undefined, string>;
}

export type PasswordReset = Selectable<PasswordResetTable>;
export type NewPasswordReset = Insertable<PasswordResetTable>;
export type PasswordResetUpdate = Updateable<PasswordResetTable>;

export interface ActivityLogTable {
  id: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string>;

  profileId: string;
  action: string;
  data: string | null;
}

export type ActivityLog = Selectable<ActivityLogTable>;
export type NewActivityLog = Insertable<ActivityLogTable>;
export type ActivityLogUpdate = Updateable<ActivityLogTable>;
