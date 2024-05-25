import React from 'react';
import 'virtual:uno.css';
import ReactDOMServer from 'react-dom/server';
import { App } from './App.jsx';
import { HubRecipeData } from './types.js';

export type { HubRecipeData } from './types.js';

export function serverRender(snapshot: HubRecipeData, url: string) {
  return ReactDOMServer.renderToStaticMarkup(
    <App recipe={snapshot} url={url} />,
  );
}
