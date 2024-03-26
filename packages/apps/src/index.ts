export type AppManifest<Id extends string> = {
  id: Id;
  url: string;
  name: string;
  description: string;
  mainImageUrl?: string;
  iconUrl: string;
  size?: number;
  devOriginOverride: string;
};

export const apps = [
  {
    id: 'gnocchi',
    url: 'https://gnocchi.club',
    name: 'Gnocchi',
    description: "Maybe you're cooking every week and want to get organized",
    mainImageUrl: 'https://gnocchi.club/og-image.png',
    iconUrl: 'https://gnocchi.club/icon.png',
    size: 4,
    devOriginOverride: 'http://localhost:6220',
  } satisfies AppManifest<'gnocchi'>,
  {
    id: 'trip-tick',
    url: 'https://trip-tick.biscuits.club',
    name: 'Trip Tick',
    description: "Maybe you're planning what to pack on your next trip",
    iconUrl: '',
    size: 2,
    devOriginOverride: 'http://localhost:6221',
  } satisfies AppManifest<'trip-tick'>,
] as const;

export type AppId = (typeof apps)[number]['id'];

export const appIds = apps.map((app) => app.id) as AppId[];
export function isValidAppId(appId: string): appId is AppId {
  return appIds.includes(appId as AppId);
}

export const appsById = Object.fromEntries(
  apps.map((app) => [app.id, app]),
) as Record<AppId, (typeof apps)[number]>;
