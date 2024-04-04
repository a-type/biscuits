import 'uno.css';
import '@biscuits/client/henrietta.css';
import './main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pages } from './pages/index.jsx';
import { Provider, onPageError } from '@biscuits/client';
import { toast, Toaster } from 'react-hot-toast';
import { IconSpritesheet } from '@a-type/ui/components/icon';
import { client } from './graphql.js';

onPageError(
  (err) =>
    !!toast.error(err, {
      duration: 10000,
    }),
);

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
