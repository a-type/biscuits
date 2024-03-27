import { LocalFileStorage, Server, UserProfiles } from '@verdant-web/server';
import { sqlStorage } from '@verdant-web/server/storage';
import { DEPLOYED_ORIGIN } from '../config/deployedContext.js';
import { assert } from '@a-type/utils';
import { S3FileStorage } from '@verdant-web/s3-file-storage';
import { db, userNameSelector } from '@biscuits/db';
import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { Logger } from '../logger.js';
import { changeListener } from './changeHander.js';

const STORAGE_DATABASE_FILE = process.env.STORAGE_DATABASE_FILE;
assert(
  !!STORAGE_DATABASE_FILE,
  'STORAGE_DATABASE_FILE environment variable must be set',
);
const VERDANT_SECRET = process.env.VERDANT_SECRET;
assert(!!VERDANT_SECRET, 'VERDANT_SECRET environment variable must be set');

class Profiles implements UserProfiles<BiscuitsVerdantProfile> {
  get = async (userId: string) => {
    const profile = await db
      .selectFrom('User')
      .select(['id', 'imageUrl'])
      .select(userNameSelector)
      .where('id', '=', userId)
      .executeTakeFirst();

    if (profile) {
      return {
        id: profile.id,
        name: profile.name,
        imageUrl: profile.imageUrl,
      };
    } else {
      return {
        id: userId,
        name: 'Anonymous',
        imageUrl: null,
      };
    }
  };
}

const logger = new Logger('🌿');
export const verdantServer = new Server({
  storage: sqlStorage({
    databaseFile: STORAGE_DATABASE_FILE!,
  }),
  tokenSecret: VERDANT_SECRET!,
  profiles: new Profiles(),
  replicaTruancyMinutes: 14 * 60 * 24,
  log: logger.debug.bind(logger),
  fileStorage:
    process.env.NODE_ENV === 'production'
      ? new S3FileStorage({
          region: 'us-east-1',
          bucketName: 'files.biscuits.club',
        })
      : new LocalFileStorage({
          rootDirectory: 'userFiles',
          host: DEPLOYED_ORIGIN,
        }),
  fileConfig: {
    deleteExpirationDays: 3,
  },
});

verdantServer.on('error', console.error);
verdantServer.on('changes', changeListener.update);
