import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('User')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('fullName', 'text', (col) => col.notNull())
    .addColumn('friendlyName', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('imageUrl', 'text')
    .addColumn('password', 'text')
    .addColumn('isProductAdmin', 'boolean', (col) => col.notNull())
    .addColumn('planId', 'text', (col) =>
      col.references('Plan.id').onDelete('set null'),
    )
    .addColumn('planRole', 'text')
    .addColumn('emailVerifiedAt', 'datetime')
    .execute();

  await db.schema
    .createTable('Account')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('providerAccountId', 'text', (col) => col.notNull())
    .addColumn('refreshToken', 'text')
    .addColumn('accessToken', 'text')
    .addColumn('tokenType', 'text')
    .addColumn('accessTokenExpiresAt', 'datetime')
    .addColumn('scope', 'text')
    .addColumn('idToken', 'text')
    .addColumn('userId', 'text', (col) =>
      col.notNull().references('User.id').onDelete('cascade'),
    )
    .execute();

  await db.schema
    .createTable('Plan')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('name', 'text', (col) => col.notNull().defaultTo('Your Plan'))
    .addColumn('stripeProductId', 'text')
    .addColumn('stripePriceId', 'text')
    .addColumn('stripeSubscriptionId', 'text')
    .addColumn('stripeCustomerId', 'text')
    .addColumn('subscriptionStatus', 'text')
    .addColumn('subscriptionStatusCheckedAt', 'datetime')
    .addColumn('subscriptionExpiresAt', 'datetime')
    .addColumn('subscriptionCanceledAt', 'datetime')
    .addColumn('featureFlags', 'text', (cb) => cb.notNull().defaultTo('{}'))
    .execute();

  await db.schema
    .createTable('PlanInvitation')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('planId', 'text', (col) =>
      col.notNull().references('Plan.id').onDelete('cascade'),
    )
    .addColumn('inviterId', 'text', (col) =>
      col.notNull().references('User.id'),
    )
    .addColumn('inviterName', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'datetime', (col) => col.notNull())
    .addColumn('claimedAt', 'datetime')
    .execute();

  await db.schema
    .createTable('VerificationCode')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'datetime', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('ActivityLog')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('createdAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updatedAt', 'datetime', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    // not a foreign key. we want this intact if user deletes.
    .addColumn('userId', 'varchar')
    .addColumn('action', 'text', (col) => col.notNull())
    .addColumn('data', 'text')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('ActivityLog').execute();
  await db.schema.dropTable('VerificationCode').execute();
  await db.schema.dropTable('PlanInvitation').execute();
  await db.schema.dropTable('PlanMembership').execute();
  await db.schema.dropTable('Plan').execute();
  await db.schema.dropTable('Account').execute();
  await db.schema.dropTable('User').execute();
}
