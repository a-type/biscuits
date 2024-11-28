import ReactDOM from 'react-dom/client';
import 'virtual:uno.css';
import { App } from './App.jsx';

// @ts-ignore
const snapshot = window.__SNAPSHOT__;

ReactDOM.hydrateRoot(
	document.getElementById('root')!,
	<App recipe={snapshot} url={window.location.href} />,
);
