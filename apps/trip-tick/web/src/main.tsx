import '@a-type/ui/main.css';
import '@biscuits/client/henrietta.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'virtual:uno.css';
import { App } from './App.js';

function main() {
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}

main();
