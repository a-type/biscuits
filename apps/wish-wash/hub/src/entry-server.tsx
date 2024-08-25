import React from 'react';
import 'virtual:uno.css';
import ReactDOMServer from 'react-dom/server';
import { App } from './App.jsx';
import { HubWishlistData } from './types.js';

export type { HubWishlistData } from './types.js';

export function serverRender(snapshot: HubWishlistData): string {
  return ReactDOMServer.renderToStaticMarkup(<App list={snapshot} />);
}
