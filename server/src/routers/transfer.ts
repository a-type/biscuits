import { assert } from '@a-type/utils';
import { apps, isValidAppId } from '@biscuits/apps';
import { BiscuitsError } from '@biscuits/error';
import { randomUUID } from 'crypto';
import { Router } from 'itty-router';

// temporary functionality to transfer a user's verdant data
// from gnocchi.club to biscuits.club

export const transferRouter = Router({
  base: '/transfer',
});

const fileCache = new Map<string, File>();

transferRouter.post('/', async (req) => {
  // the request should come with a file containing the user's data.
  // we store that in memory while the user navigates to the
  // new app domain and then retrieves it from the other route by
  // the ID we give it.
  const data = await req.formData();
  const file = data.get('file');
  const appId = data.get('appId');

  if (!file) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'file must be provided',
    );
  }

  if (typeof file === 'string') {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'file must be a file, not a string',
    );
  }

  if (!appId) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'appId must be provided',
    );
  }

  if (typeof appId !== 'string') {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      'appId must be a string',
    );
  }

  if (!isValidAppId(appId)) {
    throw new BiscuitsError(
      BiscuitsError.Code.BadRequest,
      `appId must be one of ${apps.map((app) => app.id).join(', ')}`,
    );
  }

  const appManifest = apps.find((app) => app.id === appId);
  assert(!!appManifest, 'Missing app manifest for ' + appId);

  const id = randomUUID();
  fileCache.set(id, file);

  // remove file after 1 hour
  setTimeout(
    () => {
      fileCache.delete(id);
    },
    1000 * 60 * 60,
  );

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${appManifest.devOriginOverride}?transferId=${id}`,
    },
  });
});

transferRouter.get('/:id', async (req, params) => {
  const id = params.id;
  const file = fileCache.get(id);
  if (!file) {
    throw new BiscuitsError(BiscuitsError.Code.NotFound, 'file not found');
  }

  fileCache.delete(id);

  return new Response(file, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
});
