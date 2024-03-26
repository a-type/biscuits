import 'uno.css';
import './main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pages } from './pages/index.jsx';
import { Provider } from 'urql';
import { client } from './graphql.js';
import { Toaster } from 'react-hot-toast';
import { IconSpritesheet } from '@a-type/ui/components/icon';

function main() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <Provider value={client}>
        <Pages />
        <Toaster position="bottom-center" />
        <IconSpritesheet />
      </Provider>
    </StrictMode>,
  );
}

main();
