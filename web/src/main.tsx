import 'uno.css';
import './main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pages } from './pages/index.jsx';
import { Provider } from '@biscuits/client';
import { Toaster } from 'react-hot-toast';
import { IconSpritesheet } from '@a-type/ui/components/icon';
import { client } from './graphql.js';

function main() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <Provider graphqlClient={client}>
        <Pages />
        <Toaster position="bottom-center" />
        <IconSpritesheet />
      </Provider>
    </StrictMode>,
  );
}

main();
