import { appsById } from '@biscuits/apps';
import { useAppId } from '../react.js';

export function useAppInfo() {
  const appId = useAppId();
  const info = appsById[appId];
  if (import.meta.env.DEV) {
    return {
      ...info,
      url: info.devOriginOverride,
    };
  }
  return info;
}
