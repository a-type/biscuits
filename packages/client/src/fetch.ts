import { BiscuitsError } from '@biscuits/error';
import { CONFIG } from './index.js';

// on window load, check for a refresh token param
// and store it if found.
if (typeof window !== 'undefined') {
  window.addEventListener('load', async () => {
    const url = new URL(window.location.href);
    const refreshToken = url.searchParams.get('refreshToken');
    if (refreshToken) {
      if (window.location.origin !== CONFIG.HOME_ORIGIN) {
        await storeRefreshTokenInMain(refreshToken);
      } else {
        refreshTokenStorage.set(refreshToken);
      }
      // remove it
      url.searchParams.delete('refreshToken');
      url.searchParams.delete('refreshTokenExpiresAt');
      window.history.replaceState({}, '', url.toString());
    }
  });
}

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

export const refreshTokenStorage = {
  get: () => window.localStorage.getItem('biscuits-refresh'),
  set: (token: string) =>
    window.localStorage.setItem('biscuits-refresh', token),
  clear: () => window.localStorage.removeItem('biscuits-refresh'),
};

export async function refreshSession(
  apiOrigin: string,
  disableIframeFallback = false,
) {
  if (!refreshPromise) {
    refreshPromise = refreshSessionInternal(apiOrigin, disableIframeFallback);
    refreshPromise.finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

let refreshPromise: Promise<boolean> | null = null;
async function refreshSessionInternal(
  apiOrigin: string,
  disableIframeFallback = false,
) {
  const refreshToken = refreshTokenStorage.get();
  if (!refreshToken || refreshToken === 'undefined') {
    if (disableIframeFallback) {
      console.error('no refresh token found');
      return false;
    } else {
      console.log('attempting to refresh session via iframe');
      return refreshSessionViaIframe();
    }
  }

  try {
    const response = await fetch(`${apiOrigin}/auth/refresh`, {
      method: 'POST',
      headers: {
        'X-Refresh-Token': refreshToken,
      },
    });
    if (response.ok) {
      const body = await response.json();
      // store the new refresh token
      refreshTokenStorage.set(body.refreshToken);
      console.info('session refreshed');
    } else if (response.status === 401 || response.status === 403) {
      console.error('session refresh failed', response.status);
      refreshTokenStorage.clear();
    } else {
      console.error('session refresh failed', response.status);
    }
    return response.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function refreshSessionViaIframe() {
  let iframe: HTMLIFrameElement | null = null;
  try {
    await new Promise<void>((resolve, reject) => {
      // failure case: if the iframe doesn't load, reject
      let timeout = setTimeout(() => {
        reject(new Error('iframe-based session refresh timed out'));
      }, 5000);

      const iframeUrl = `${CONFIG.HOME_ORIGIN}/refreshSession/`;
      // go ahead and subscribe to postMessage events
      window.addEventListener('message', (event) => {
        if (event.data.type === 'refresh-session') {
          if (event.data.success) {
            console.debug('refreshed session via iframe');
            // store the new refresh token
            refreshTokenStorage.set(event.data.success.refreshToken);
            resolve();
            clearTimeout(timeout);
          } else {
            console.error('session refresh failed via iframe');
            reject(new Error('session refresh failed via iframe'));
          }
        }
      });
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = iframeUrl;
      iframe.addEventListener('error', (ev) => {
        console.error('iframe failed to load', ev.error);
        reject(ev.error);
      });
      document.body.appendChild(iframe);
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  } finally {
    if (iframe) {
      document.body.removeChild(iframe);
    }
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

async function storeRefreshTokenInMain(token: string) {
  let iframe: HTMLIFrameElement | null = null;
  try {
    return await new Promise<void>((resolve, reject) => {
      const iframeUrl = `${CONFIG.HOME_ORIGIN}/storeRefreshToken/`;
      // go ahead and subscribe to postMessage events
      window.addEventListener('message', (event) => {
        if (event.data.type === 'ready') {
          console.debug('[store token] iframe ready');
          // send the token
          if (!iframe?.contentWindow) {
            console.error('[store token] iframe contentWindow not available');
            reject(new Error('iframe contentWindow not available'));
            return;
          }
          iframe.contentWindow.postMessage(
            {
              type: 'store-refresh-token',
              refreshToken: token,
            },
            '*',
          );
        } else if (event.data.type === 'done') {
          console.debug('[store token] token stored');
          resolve();
        }
      });
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = iframeUrl;
      iframe.addEventListener('error', (ev) => {
        console.error('[store token] iframe failed to load', ev.error);
        reject(ev.error);
      });
      document.body.appendChild(iframe);
    });
  } finally {
    if (iframe) {
      document.body.removeChild(iframe);
    }
  }
}
