import '@biscuits/client/henrietta.css';
import 'uno.css';
import './main.css';

import { handleAppState } from '@a-type/auth-ui';
import { Provider as UIProvider } from '@a-type/ui';
import { AppId, appsById } from '@biscuits/apps';
import { Provider } from '@biscuits/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { client } from './graphql.js';
import { Pages } from './pages/index.jsx';

function main() {
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<UIProvider>
				<Provider graphqlClient={client}>
					<Pages />
				</Provider>
			</UIProvider>
		</StrictMode>,
	);
}

main();

handleAppState((appState) => {
	if (appState?.appReferrer) {
		const app = appsById[appState.appReferrer as AppId];
		if (!app) return;

		const returnToPath = appState?.appReturnTo ?? '/';
		const url = new URL(
			returnToPath,
			import.meta.env.DEV ? app.devOriginOverride : app.url,
		);
		window.location.href = url.toString();
	}
});
