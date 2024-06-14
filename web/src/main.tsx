import { Provider as UIProvider } from '@a-type/ui/components/provider';
import { Provider } from '@biscuits/client';
import '@biscuits/client/henrietta.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'uno.css';
import { client } from './graphql.js';
import './main.css';
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
