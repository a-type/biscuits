import { BiscuitsError } from '@biscuits/error';
import { CONFIG } from './index.js';

// on window load, check for a refresh token param
// and store it if found.
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const url = new URL(window.location.href);
    const refreshToken = url.searchParams.get('refreshToken');
    if (refreshToken) {
      refreshTokenStorage.set(refreshToken);
      // remove it
      url.searchParams.delete('refreshToken');
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

const refreshTokenStorage = {
  get: () => window.localStorage.getItem('biscuits-refresh'),
  set: (token: string) =>
    window.localStorage.setItem('biscuits-refresh', token),
};

export async function refreshSession(apiOrigin: string) {
  const refreshToken = refreshTokenStorage.get();
  if (!refreshToken || refreshToken === 'undefined')
    return refreshSessionViaIframe();
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
    return await new Promise<void>((resolve, reject) => {
      const iframeUrl = `${CONFIG.HOME_ORIGIN}/refresh-session`;
      // go ahead and subscribe to postMessage events
      window.addEventListener('message', (event) => {
        if (event.data.type === 'refresh-session') {
          if (event.data.success) {
            console.log('refreshed session via iframe');
            // store the new refresh token
            refreshTokenStorage.set(event.data.success.refreshToken);
            resolve();
          } else {
            console.error('session refresh failed via iframe');
            reject(new Error('session refresh failed via iframe'));
          }
        }
      });
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = iframeUrl;
      iframe.addEventListener('load', () => {
        console.debug('iframe loaded');
      });
      iframe.addEventListener('error', (ev) => {
        console.error('iframe failed to load', ev.error);
        reject(ev.error);
      });
      document.body.appendChild(iframe);

      // failure case: if the iframe doesn't load, reject
      setTimeout(() => {
        reject(new Error('iframe-based session refresh timed out'));
      }, 5000);
    });
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
