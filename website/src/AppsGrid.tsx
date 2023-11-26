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
    <div
      className="flex flex-col"
      style={{
        gridColumn: `span ${app.size}`,
      }}
    >
      <a
        href={app.url}
        className="flex flex-col flex-1 rounded-lg overflow-hidden ring-black ring bg-cover bg-center items-start justify-end p-4"
        style={{
          backgroundImage: `url(${app.image})`,
          boxShadow: `0px 10px 20px -3px rgba(0,0,0,0.1),-2px 10px 57px 11px rgba(0,0,0,0.1),-1px 3px 3px 0px rgba(0,0,0,0.1)`,
        }}
      >
        <h2 className="m-0 p-0">{app.name}</h2>
      </a>
      <p>{app.description}</p>
    </div>
  );
}
