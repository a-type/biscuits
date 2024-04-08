import { CONFIG, refreshSession } from '@biscuits/client';

async function run() {
  const ok = await refreshSession(CONFIG.API_ORIGIN, true);
  if (window.top) {
    window.top.postMessage({ type: 'refresh-session', success: ok }, '*');
  }
}

run();
