import { Kysely } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('Profile')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) => col.notNull())
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('fullName', 'text', (col) => col.notNull())
    .addColumn('friendlyName', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('imageUrl', 'text')
    .addColumn('password', 'text')
    .addColumn('isProductAdmin', 'boolean', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('Account')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) => col.notNull())
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('providerAccountId', 'text', (col) => col.notNull())
    .addColumn('refreshToken', 'text')
    .addColumn('accessToken', 'text')
    .addColumn('tokenType', 'text')
    .addColumn('accessTokenExpiresAt', 'text')
    .addColumn('profileId', 'text', (col) =>
      col.notNull().references('Profile'),
    )
    .execute();

  await db.schema
    .createTable('Plan')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) => col.notNull())
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('stripeProductId', 'text', (col) => col.notNull())
    .addColumn('stripePriceId', 'text', (col) => col.notNull())
    .addColumn('stripeSubscriptionId', 'text')
    .addColumn('stripeCustomerId', 'text')
    .addColumn('subscriptionStatus', 'text')
    .addColumn('subscriptionStatusCheckedAt', 'text')
    .addColumn('subscriptionExpiresAt', 'text')
    .addColumn('subscriptionCanceledAt', 'text')
    .addColumn('featureFlags', 'text')
    .execute();

  await db.schema
    .createTable('PlanMembership')
    .addColumn('profileId', 'text', (col) =>
      col.notNull().references('Profile'),
    )
    .addColumn('planId', 'text', (col) => col.notNull().references('Plan'))
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('PlanInvitation')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) => col.notNull())
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('planId', 'text', (col) => col.notNull().references('Plan'))
    .addColumn('inviterId', 'text', (col) =>
      col.notNull().references('Profile'),
    )
    .addColumn('inviterName', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'text', (col) => col.notNull())
    .addColumn('claimedAt', 'text')
    .execute();

  await db.schema
    .createTable('EmailVerification')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) => col.notNull())
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('PasswordReset')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) => col.notNull())
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('ActivityLog')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) => col.notNull())
    .addColumn('profileId', 'text', (col) =>
      col.notNull().references('Profile'),
    )
    .addColumn('action', 'text', (col) => col.notNull())
    .addColumn('data', 'text')
    .execute();
}
