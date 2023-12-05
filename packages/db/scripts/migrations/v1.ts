import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('Profile')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('fullName', 'text', (col) => col.notNull())
    .addColumn('friendlyName', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('imageUrl', 'text')
    .addColumn('password', 'text')
    .addColumn('isProductAdmin', 'boolean', (col) => col.notNull())
    .addColumn('planId', 'text', (col) =>
      col.references('Plan').onDelete('set null'),
    )
    .addColumn('planRole', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('Account')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('providerAccountId', 'text', (col) => col.notNull())
    .addColumn('refreshToken', 'text')
    .addColumn('accessToken', 'text')
    .addColumn('tokenType', 'text')
    .addColumn('accessTokenExpiresAt', 'text')
    .addColumn('profileId', 'text', (col) =>
      col.notNull().references('Profile').onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createTable('Plan')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
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
    .addColumn('featureFlags', 'text', (cb) => cb.defaultTo('{}'))
    .execute();

  await db.schema
    .createTable('PlanMembership')
    .addColumn('profileId', 'text', (col) =>
      col.notNull().references('Profile').onDelete('cascade'),
    )
    .addColumn('planId', 'text', (col) => col.notNull().references('Plan'))
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'text', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await db.schema
    .createTable('PlanInvitation')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('planId', 'text', (col) =>
      col.notNull().references('Plan').onDelete('cascade'),
    )
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
    .addColumn('createdAt', 'text', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('PasswordReset')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updatedAt', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('ActivityLog')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'text', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('profileId', 'text', (col) =>
      col.notNull().references('Profile').onDelete('no action'),
    )
    .addColumn('action', 'text', (col) => col.notNull())
    .addColumn('data', 'text')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('ActivityLog').execute();
  await db.schema.dropTable('PasswordReset').execute();
  await db.schema.dropTable('EmailVerification').execute();
  await db.schema.dropTable('PlanInvitation').execute();
  await db.schema.dropTable('PlanMembership').execute();
  await db.schema.dropTable('Plan').execute();
  await db.schema.dropTable('Account').execute();
  await db.schema.dropTable('Profile').execute();
}
