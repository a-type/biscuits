import React from 'react';
import 'virtual:uno.css';
import ReactDOMServer from 'react-dom/server';
import { App } from './App.jsx';

export function serverRender(snapshot: any, url: string) {
  return ReactDOMServer.renderToStaticMarkup(
    <App recipe={snapshot} url={url} />,
  );
}
