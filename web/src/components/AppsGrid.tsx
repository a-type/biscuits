import classNames from 'classnames';

type AppDefinition = {
  name: string;
  description: string;
  url: string;
  image: string;
  size: number;
};

const APPS: AppDefinition[] = [
  {
    name: 'Gnocchi',
    description: "Maybe you're cooking every week and want to get organized",
    url: 'https://gnocchi.club',
    image: 'https://gnocchi.club/og-image.png',
    size: 4,
  },
];

export function AppsGrid() {
  return (
    <div className="grid grid-cols-6 [grid-template-rows:320px] gap-2">
      {APPS.map((app) => (
        <AppCard key={app.url} app={app} />
      ))}
    </div>
  );
}

function AppCard({ app }: { app: AppDefinition }) {
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
      href={app.url}
    >
      <div
        className={classNames(
          'flex flex-col flex-1 overflow-hidden bg-cover bg-center items-start justify-end p-4',
          'border-0 border-b border-solid border-black',
        )}
        style={{
          backgroundImage: `url(${app.image})`,
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
