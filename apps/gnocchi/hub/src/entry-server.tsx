import ReactDOMServer from 'react-dom/server';
import { App } from './App.jsx';

export function serverRender() {
  return ReactDOMServer.renderToStaticMarkup(<App />);
}
