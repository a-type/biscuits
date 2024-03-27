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
  const search = new URLSearchParams(window.location.search);
  const hostApp = search.get('hostApp');

  const goTo = (id: string) => {
    window.parent.postMessage(
      JSON.stringify({ type: 'navigate', payload: { appId: id } }),
      '*',
    );
  };

  return (
    <div
      className="grid grid-cols-2 gap-4 h-auto p-4"
      style={{
        width: 40 * 2 + 16 + 32,
      }}
    >
      {apps
        .filter((app) => app.id !== hostApp)
        .map((app) => {
          const iconUrl = new URL(
            import.meta.env.DEV ? app.devOriginOverride : app.url,
          );
          iconUrl.pathname = app.iconPath;
          return (
            <button
              key={app.id}
              className="bg-gray-200 rounded p-0 w-auto h-auto flex appearance-none border-none cursor-pointer"
              onClick={() => goTo(app.id)}
            >
              <img
                src={iconUrl}
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
