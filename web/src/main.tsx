import 'uno.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pages } from './pages/index.jsx';
import { Provider } from 'urql';
import { client } from './graphql.js';

function main() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <Provider value={client}>
        <Pages />
      </Provider>
    </StrictMode>,
  );
}

main();
