import ReactDOMServer from 'react-dom/server';
import 'virtual:uno.css';
import { App } from './App.js';
import { HubWishlistData } from './types.js';

export type { HubWishlistData } from './types.js';

export function serverRender(snapshot: HubWishlistData): string {
	return ReactDOMServer.renderToStaticMarkup(<App list={snapshot} />);
}
