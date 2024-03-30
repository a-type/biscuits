import 'virtual:uno.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import '@a-type/ui/main.css';

function main() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main();
