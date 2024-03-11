import 'uno.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'urql';
import { client } from '../src/graphql.js';
import { apps } from '@biscuits/apps';

function main() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <Provider value={client}>
        <AppIcons />
      </Provider>
    </StrictMode>,
  );
}

function AppIcons() {
  const goTo = (id: string) => {
    window.parent.postMessage(
      JSON.stringify({ type: 'navigate', payload: { appId: id } }),
      '*',
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-[152px] h-auto p-4">
      {apps.map((app) => {
        return (
          <button
            key={app.id}
            className="bg-gray-200 rounded p-0 w-auto h-auto flex appearance-none border-none"
            onClick={() => goTo(app.id)}
          >
            <img
              src={app.iconUrl}
              alt={app.name}
              className="w-[40px] h-[40px] block"
            />
          </button>
        );
      })}
    </div>
  );
}

main();
