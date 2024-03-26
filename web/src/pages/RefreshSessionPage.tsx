import { useMe } from '@biscuits/client';
import { useEffect } from 'react';

/**
 * A stub page that just calls an API request. This will automatically trigger session
 * refresh if the user is logged in. This page is rendered in an iframe by other apps
 * on other origins to transparently keep the session alive without having to know
 * the refresh token, which is stored in this app's origin localStorage.
 */
export function RefreshSessionPage() {
  const [data] = useMe();
  const success = data.data?.me;
  useEffect(() => {
    if (window.top) {
      window.top.postMessage({ type: 'refresh-session', success }, '*');
    }
  }, [success]);
  return null;
}

export default RefreshSessionPage;
