import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import 'virtual:uno.css';

// @ts-ignore
const snapshot = window.__SNAPSHOT__;

ReactDOM.hydrateRoot(document.getElementById('root')!, <App list={snapshot} />);
