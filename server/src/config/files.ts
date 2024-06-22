import { assert } from '@a-type/utils';

export const OLD_STORAGE_DATABASE_FILE = process.env.STORAGE_DATABASE_FILE;
export const STORAGE_DATABASES_DIRECTORY =
  process.env.STORAGE_DATABASES_DIRECTORY!;
assert(
  !!STORAGE_DATABASES_DIRECTORY,
  'STORAGE_DATABASES_DIRECTORY environment variable must be set',
);

export const USER_FILES_BUCKET = 'user-files.biscuits.club';
export const USER_FILES_BUCKET_REGION = 'us-east-1';
