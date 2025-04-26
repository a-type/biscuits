import ReactDOM from 'react-dom/client';
import 'virtual:uno.css';
import { App } from './App.js';

const snapshot = (window as any).__SNAPSHOT__;

ReactDOM.hydrateRoot(document.getElementById('root')!, <App list={snapshot} />);
