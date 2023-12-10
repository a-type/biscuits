import 'uno.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Pages } from './pages/index.jsx';
import { ClientProvider } from '@biscuits/client/react';

function main() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <ClientProvider baseUrl={import.meta.env.VITE_API_URL}>
      <StrictMode>
        <Pages />
      </StrictMode>
    </ClientProvider>,
  );
}

main();
