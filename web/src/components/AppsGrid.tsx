import classNames from 'classnames';
import { AppId, AppManifest, apps } from '@biscuits/apps';

export function AppsGrid() {
  return (
    <div
      className={classNames(
        'grid grid-cols-4 [grid-template-rows:320px] gap-4',
        'lg:grid-cols-6',
      )}
    >
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}

function AppCard({ app }: { app: AppManifest<AppId> }) {
  const url = import.meta.env.DEV ? app.devOriginOverride : app.url;
  return (
    <a
      className={classNames(
        'flex flex-col rounded-lg overflow-hidden ring-black ring bg-white relative',
        'transition-all duration-200 ease-in-out transform hover:scale-105',
        'hover:ring-4 hover:z-1',
      )}
      style={{
        gridColumn: `span ${app.size}`,
      }}
      href={url}
    >
      <div
        className={classNames(
          'flex flex-col flex-1 overflow-hidden bg-cover bg-center items-start justify-end p-4',
          'border-0 border-b border-solid border-black hover:border-b-4 transition-border-width',
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
