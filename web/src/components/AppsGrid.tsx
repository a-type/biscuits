import classNames from 'classnames';
import { AppId, AppManifest, apps } from '@biscuits/apps';

export function AppsGrid() {
  return (
    <div className="grid grid-cols-6 [grid-template-rows:320px] gap-2">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}

const DEV_URL_OVERRIDES: Record<AppId, string> = {
  gnocchi: 'http://localhost:6220',
  'trip-tick': 'http://localhost:6221',
};

function AppCard({ app }: { app: AppManifest<AppId> }) {
  const url = import.meta.env.DEV
    ? DEV_URL_OVERRIDES[app.id]
    : `https://${app.id}.${window.location.host}`;
  return (
    <a
      className={classNames(
        'flex flex-col rounded-lg overflow-hidden ring-black ring bg-white',
        'transition-all duration-200 ease-in-out transform hover:scale-105',
        'hover:ring-4',
      )}
      style={{
        gridColumn: `span ${app.size}`,
      }}
      href={url}
    >
      <div
        className={classNames(
          'flex flex-col flex-1 overflow-hidden bg-cover bg-center items-start justify-end p-4',
          'border-0 border-b border-solid border-black',
        )}
        style={{
          backgroundImage: app.mainImageUrl
            ? `url(${app.mainImageUrl})`
            : 'none',
        }}
      >
        <h2
          className={classNames(
            'm-0 p-0 text-3xl',
            '[font-family:"VC_Henrietta_Trial","Noto_Serif",serif]',
          )}
        >
          {app.name}
        </h2>
      </div>
      <div className="p-3 font-semibold">{app.description}</div>
    </a>
  );
}
