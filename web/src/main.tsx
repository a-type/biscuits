import '@biscuits/client/henrietta.css';
import 'uno.css';
import './main.css';

import { Provider as UIProvider } from '@a-type/ui/components/provider';
import { Provider } from '@biscuits/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { client } from './graphql.js';
import { Pages } from './pages/index.jsx';
import { handleAppState } from '@a-type/auth-client';
import { AppId, appsById } from '@biscuits/apps';

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
