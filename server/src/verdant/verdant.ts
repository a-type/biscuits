import { LocalFileStorage, Server, UserProfiles } from '@verdant-web/server';
import { sqlShardStorage } from '@verdant-web/server/storage';
import { DEPLOYED_ORIGIN } from '../config/deployedContext.js';
import { S3FileStorage } from '@verdant-web/s3-file-storage';
import { db, userNameSelector } from '@biscuits/db';
import { BiscuitsVerdantProfile } from '@biscuits/libraries';
import { Logger } from '../logger.js';
import { changeListener } from './changeHander.js';
import {
  OLD_STORAGE_DATABASE_FILE,
  STORAGE_DATABASES_DIRECTORY,
  USER_FILES_BUCKET,
  USER_FILES_BUCKET_REGION,
} from '../config/files.js';
import { VERDANT_SECRET } from '../config/secrets.js';

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
  storage: sqlShardStorage({
    databasesDirectory: STORAGE_DATABASES_DIRECTORY,
    // transferFromUnifiedDatabaseFile: OLD_STORAGE_DATABASE_FILE,
  }),
  tokenSecret: VERDANT_SECRET,
  profiles: new Profiles(),
  replicaTruancyMinutes: 14 * 60 * 24,
  log: logger.debug.bind(logger),
  fileStorage:
    process.env.NODE_ENV === 'production'
      ? new S3FileStorage({
          region: USER_FILES_BUCKET_REGION,
          bucketName: USER_FILES_BUCKET,
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
