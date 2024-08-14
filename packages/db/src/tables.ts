import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface Database {
  User: UserTable;
  Account: AccountTable;
  Plan: PlanTable;
  PlanInvitation: PlanInvitationTable;
  ActivityLog: ActivityLogTable;
  VerificationCode: VerificationCodeTable;
  PushSubscription: PushSubscriptionTable;
  ChangelogItem: ChangelogItemTable;
  Food: FoodTable;
  FoodName: FoodNameTable;
  FoodCategoryAssignment: FoodCategoryAssignmentTable;
  FoodCategory: FoodCategoryTable;
  PublishedRecipe: PublishedRecipeTable;
  PublishedWishlist: PublishedWishlistTable;
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

  /** The Stripe Customer associated with this user. */
  stripeCustomerId: string | null;

  planId: string | null;
  planRole: 'admin' | 'user' | null;

  preferences: ColumnType<
    Record<string, any>,
    Record<string, any> | undefined,
    Record<string, any> | undefined
  >;

  acceptedTosAt: ColumnType<Date, Date | undefined, Date | undefined> | null;
  sendEmailUpdates: ColumnType<boolean, boolean | undefined, boolean>;
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
  subscriptionStatus: string | null;
  subscriptionStatusCheckedAt: ColumnType<
    Date,
    number | undefined,
    number
  > | null;
  subscriptionExpiresAt: Date | null;
  subscriptionCanceledAt: Date | null;
  featureFlags: ColumnType<
    Record<string, boolean>,
    Record<string, boolean> | undefined,
    Record<string, boolean>
  >;
  memberLimit: Generated<number>;
  allowedApp: string | null;
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
  expiresAt: Date;
  claimedAt: Date | null;
  email: string;
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

export interface PushSubscriptionTable {
  endpoint: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  appId: string;
  auth: string | null;
  p256dh: string | null;
  userId: string | null;
}

export type PushSubscription = Selectable<PushSubscriptionTable>;
export type NewPushSubscription = Insertable<PushSubscriptionTable>;
export type PushSubscriptionUpdate = Updateable<PushSubscriptionTable>;

export interface ChangelogItemTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  title: string;
  details: string;
  imageUrl: string | null;
  important: boolean;
  appId: string;
}

export type ChangelogItem = Selectable<ChangelogItemTable>;
export type NewChangelogItem = Insertable<ChangelogItemTable>;
export type ChangelogItemUpdate = Updateable<ChangelogItemTable>;

export interface FoodTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  canonicalName: string;
}

export type Food = Selectable<FoodTable>;
export type NewFood = Insertable<FoodTable>;
export type FoodUpdate = Updateable<FoodTable>;

export interface FoodNameTable {
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  name: string;
  foodId: string;
}

export type FoodName = Selectable<FoodNameTable>;
export type NewFoodName = Insertable<FoodNameTable>;
export type FoodNameUpdate = Updateable<FoodNameTable>;

export interface FoodCategoryAssignmentTable {
  foodId: string;
  categoryId: string;
  votes: number;
}

export type FoodCategoryAssignment = Selectable<FoodCategoryAssignmentTable>;
export type NewFoodCategoryAssignment = Insertable<FoodCategoryAssignmentTable>;
export type FoodCategoryAssignmentUpdate =
  Updateable<FoodCategoryAssignmentTable>;

export interface FoodCategoryTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  name: string;
  sortKey: string;
}

export type FoodCategory = Selectable<FoodCategoryTable>;
export type NewFoodCategory = Insertable<FoodCategoryTable>;
export type FoodCategoryUpdate = Updateable<FoodCategoryTable>;

export interface PublishedRecipeTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  publishedAt: Date;
  publishedBy: string;

  planId: string;
  slug: string;
}

export type PublishedRecipe = Selectable<PublishedRecipeTable>;
export type NewPublishedRecipe = Insertable<PublishedRecipeTable>;
export type PublishedRecipeUpdate = Updateable<PublishedRecipeTable>;

export interface PublishedWishlistTable {
  id: string;
  createdAt: ColumnType<Date, Date | undefined, never>;
  updatedAt: ColumnType<Date, Date | undefined, Date | undefined>;

  publishedAt: Date;
  publishedBy: string;

  planId: string;
  slug: string;
}

export type PublishedWishlist = Selectable<PublishedWishlistTable>;
export type NewPublishedWishlist = Insertable<PublishedWishlistTable>;
export type PublishedWishlistUpdate = Updateable<PublishedWishlistTable>;
