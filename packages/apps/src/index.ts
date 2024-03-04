export type AppManifest<Id extends string> = {
  id: Id;
  name: string;
  description: string;
  mainImageUrl?: string;
  size?: number;
};

export const apps = [
  {
    id: 'gnocchi',
    name: 'Gnocchi',
    description: "Maybe you're cooking every week and want to get organized",
    mainImageUrl: 'https://gnocchi.club/og-image.png',
    size: 4,
  } satisfies AppManifest<'gnocchi'>,
  {
    id: 'trip-tick',
    name: 'Trip Tick',
    description: "Maybe you're planning what to pack on your next trip",
    size: 2,
  } satisfies AppManifest<'trip-tick'>,
] as const;

export type AppId = (typeof apps)[number]['id'];

export const appIds = apps.map((app) => app.id) as AppId[];
export function isValidAppId(appId: string): appId is AppId {
  return appIds.includes(appId as AppId);
}
