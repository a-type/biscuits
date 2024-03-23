import { Kysely } from 'kysely';

// Add some helpful indexes

export async function up(db: Kysely<any>) {
  await db.schema
    .createIndex('VerificationCode_code')
    .on('VerificationCode')
    .column('code')
    .unique()
    .execute();
  await db.schema
    .createIndex('Account_providerAccountId')
    .on('Account')
    .column('providerAccountId')
    .execute();
  await db.schema
    .createIndex('Account_email')
    .on('Account')
    .column('email')
    .unique()
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropIndex('VerificationCode_code').ifExists().execute();
  await db.schema.dropIndex('Account_providerAccountId').ifExists().execute();
  await db.schema.dropIndex('Account_email').ifExists().execute();
}
