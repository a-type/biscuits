import { BiscuitsError } from '@biscuits/error';
import { CONFIG } from './index.js';

// wrap fetch to automatically redirect to /join on 401
export const fetch: typeof window.fetch = async (input: any, init: any) => {
  // ensure cookies are always sent
  if (typeof input === 'object') {
    input.credentials = 'include';
  }
  if (typeof init === 'object') {
    init.credentials = 'include';
  }

  const requestUrlString = typeof input === 'string' ? input : input.url;
  const requestUrlOrigin = new URL(requestUrlString).origin;

  const response = await window.fetch.bind(window)(input, init);

  const { body, clone } = await peekAtResponseBody(response);
  const biscuitsError = BiscuitsError.readResponseBody(body);
  if (biscuitsError) {
    console.error('Biscuits Error', biscuitsError);
    if (biscuitsError.code === BiscuitsError.Code.SessionExpired) {
      // if the session expired, we need to refresh it
      const refreshSuccess = await refreshSession(requestUrlOrigin);
      if (refreshSuccess) {
        // retry the original request
        return fetch(input, init);
      } else {
        // failed to refresh the session - the user needs
        // to log in again
      }
    }
  }
  return clone;
};

export async function refreshSession(apiOrigin: string) {
  if (!refreshPromise) {
    refreshPromise = refreshSessionInternal(apiOrigin);
    refreshPromise.finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

let refreshPromise: Promise<boolean> | null = null;
async function refreshSessionInternal(apiOrigin: string) {
  try {
    const response = await fetch(`${apiOrigin}/auth/refresh`, {
      method: 'POST',
    });
    if (response.ok) {
      const body = await response.json();
      if (body.ok) {
        console.info('session refreshed');
      } else {
        console.error('session refresh failed', body);
      }
    } else if (response.status === 401 || response.status === 403) {
      console.error('session refresh failed', response.status);
    } else {
      console.error('session refresh failed', response.status);
    }
    return response.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function peekAtResponseBody(response: Response): Promise<{
  body: any;
  clone: Response;
}> {
  const clone = response.clone();
  try {
    const body = await response.json();
    return {
      body,
      clone,
    };
  } catch (e) {
    console.error(e);
  }
  return {
    body: null,
    clone,
  };
}

export function login() {
  window.location.href =
    CONFIG.HOME_ORIGIN +
    '/login' +
    '?returnTo=' +
    encodeURIComponent(window.location.href);
}
