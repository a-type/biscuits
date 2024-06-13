import { useEffect } from 'react';

let defaultColor = '#ffffff';
if (typeof document !== 'undefined') {
  defaultColor =
    document.querySelector('meta[name=theme-color]')?.getAttribute('content') ??
    defaultColor;
}

function changeThemeColor(color: string) {
  // evaluate css var if necessary
  if (color.startsWith('var(')) {
    const root = document.documentElement;
    const cssVar = color.slice(4, -1).trim();
    color = getComputedStyle(root).getPropertyValue(cssVar);
  }
  var metaThemeColor = document.querySelector('meta[name=theme-color]');
  metaThemeColor?.setAttribute('content', color);
}

export function useTitleBarColor(color: string) {
  useEffect(() => {
    changeThemeColor(color);
    return () => {
      changeThemeColor(defaultColor);
    };
  }, [color]);
}
