import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  User: UserTable;
  Account: AccountTable;
  Plan: PlanTable;
  PlanInvitation: PlanInvitationTable;
  ActivityLog: ActivityLogTable;
  VerificationCode: VerificationCodeTable;
  // TODO:
  // pushSubscription: PushSubscriptionTable;
  // changelogItem: ChangelogItemTable;
}

export interface UserTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  fullName: string;
  friendlyName: string;
  email: string;
  emailVerifiedAt: string | null;
  imageUrl: string | null;

  password: string | null;
  isProductAdmin: boolean;

  planId: string | null;
  planRole: 'admin' | 'user' | null;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface AccountTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken: string | null;
  accessToken: string | null;
  tokenType: string | null;
  accessTokenExpiresAt: ColumnType<Date, Date | undefined, Date> | null;
  scope: string | null;
  idToken: string | null;
  userId: string;
}

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type AccountUpdate = Updateable<AccountTable>;

export interface PlanTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  name: string;
  stripeProductId: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  subscriptionStatus: string | null;
  subscriptionStatusCheckedAt: ColumnType<
    Date,
    number | undefined,
    number
  > | null;
  subscriptionExpiresAt: Date | null;
  subscriptionCanceledAt: Date | null;
  featureFlags: ColumnType<string, string | undefined, string>;
}

export type Plan = Selectable<PlanTable>;
export type NewPlan = Insertable<PlanTable>;
export type PlanUpdate = Updateable<PlanTable>;

export interface PlanInvitationTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  planId: string;
  inviterId: string;
  inviterName: string;
  expiresAt: Date | null;
  claimedAt: Date | null;
}

export type PlanInvitation = Selectable<PlanInvitationTable>;
export type NewPlanInvitation = Insertable<PlanInvitationTable>;
export type PlanInvitationUpdate = Updateable<PlanInvitationTable>;

export interface VerificationCodeTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  code: string;
  email: string;
  name: string;
  expiresAt: ColumnType<Date, Date | undefined, Date | undefined>;
}

export type VerificationCode = Selectable<VerificationCodeTable>;
export type NewVerificationCode = Insertable<VerificationCodeTable>;
export type VerificationCodeUpdate = Updateable<VerificationCodeTable>;

export interface PasswordResetTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  code: string;
  email: string;
  name: string;
  expiresAt: ColumnType<Date, Date | undefined, Date | undefined>;
}

export type PasswordReset = Selectable<PasswordResetTable>;
export type NewPasswordReset = Insertable<PasswordResetTable>;
export type PasswordResetUpdate = Updateable<PasswordResetTable>;

export interface ActivityLogTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  userId: string | null;
  action: string;
  data: string | null;
}

export type ActivityLog = Selectable<ActivityLogTable>;
export type NewActivityLog = Insertable<ActivityLogTable>;
export type ActivityLogUpdate = Updateable<ActivityLogTable>;
