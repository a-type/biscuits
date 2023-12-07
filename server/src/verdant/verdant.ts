import { LocalFileStorage, Server, UserProfiles } from '@verdant-web/server';
import { Server as HttpServer } from 'http';
import { DEPLOYED_HOST } from '../config/deployedContext.js';
import { assert } from '@a-type/utils';
import { S3FileStorage } from '@verdant-web/s3-file-storage';
import { db } from '@biscuits/db';

const STORAGE_DATABASE_FILE = process.env.STORAGE_DATABASE_FILE;
assert(
  !!STORAGE_DATABASE_FILE,
  'STORAGE_DATABASE_FILE environment variable must be set',
);
const VERDANT_SECRET = process.env.VERDANT_SECRET;
assert(!!VERDANT_SECRET, 'VERDANT_SECRET environment variable must be set');

class Profiles implements UserProfiles<any> {
  get = async (userId: string) => {
    const profile = await db
      .selectFrom('Profile')
      .select(['id', 'friendlyName', 'imageUrl'])
      .where('id', '=', userId)
      .executeTakeFirst();

    if (profile) {
      return {
        id: profile.id,
        name: profile.friendlyName,
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

export function attach(httpServer: HttpServer) {
  const server = new Server({
    httpServer,
    databaseFile: STORAGE_DATABASE_FILE!,
    tokenSecret: VERDANT_SECRET!,
    profiles: new Profiles(),
    replicaTruancyMinutes: 14 * 60 * 24,
    log: console.debug,
    fileStorage:
      process.env.NODE_ENV === 'production'
        ? new S3FileStorage({
            region: 'us-east-1',
            bucketName: 'files.biscuits.club',
          })
        : new LocalFileStorage({
            rootDirectory: 'userFiles',
            host: DEPLOYED_HOST,
          }),
    fileConfig: {
      deleteExpirationDays: 3,
    },
  });

  server.on('error', console.error);
  // server.on('changes', (info, operations, baselines) => {
  // });

  return server;
}
