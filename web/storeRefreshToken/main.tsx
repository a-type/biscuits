import { refreshTokenStorage } from '@biscuits/client';

// wait for a postMessage from top window with token info
window.addEventListener('message', async (event) => {
  if (event.source !== window.top) {
    return;
  }

  if (event.data.type === 'store-refresh-token') {
    const { refreshToken } = event.data;
    if (refreshToken) {
      // store the new refresh token
      refreshTokenStorage.set(refreshToken);
      console.debug('Refresh token stored!');
      window.top?.postMessage({ type: 'done' }, '*');
    }
  }
});

window.top?.postMessage({ type: 'ready' }, '*');
