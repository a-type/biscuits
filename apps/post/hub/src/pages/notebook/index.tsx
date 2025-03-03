import ReactDOM from 'react-dom/client';
import 'virtual:uno.css';
import { NotebookRoot } from './NotebookRoot.js';

// @ts-expect-error - This is injected by the server
const snapshot = window.__SNAPSHOT__;

ReactDOM.hydrateRoot(
	document.getElementById('root')!,
	<NotebookRoot {...snapshot} />,
);
