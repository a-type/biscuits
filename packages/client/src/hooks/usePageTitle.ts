import { useEffect } from 'react';
import { useAppId } from '../react.js';
import { appsById } from '@biscuits/apps';

export function usePageTitle(title: string) {
  const appId = useAppId();
  const app = appsById[appId];
  useEffect(() => {
    document.title = title + ` | ${app.name}`;
    return () => {
      document.title = app.name;
    };
  }, [title, app.name]);
}
