export type AppManifest<Id extends string> = {
  id: Id;
  url: string;
  name: string;
  description: string;
  mainImageUrl?: string;
  iconPath: string;
  size?: number;
  devOriginOverride: string;
  demoVideoSrc: string;
  paidDescription: string;
  paidFeatures: PaidFeature[];
};

export type PaidFeature = {
  imageUrl: string;
  description: string;
};

export const apps = [
  {
    id: 'gnocchi',
    url: 'https://gnocchi.club',
    name: 'Gnocchi',
    description: 'Organize your weekly cooking and groceries',
    mainImageUrl: 'https://gnocchi.club/og-image.png',
    iconPath: 'android-chrome-512x512.png',
    size: 4,
    devOriginOverride: 'http://localhost:6220',
    demoVideoSrc: '/videos/gnocchi.mp4',
    paidFeatures: [
      {
        imageUrl: '/images/gnocchi/scanner.png',
        description:
          'Scan web recipes to create a personal copy. Add notes, make changes, and collaborate on cooking with other plan members.',
      },
    ],
    paidDescription:
      'Your personal cooking app becomes a family groceries list and recipe box.',
  } satisfies AppManifest<'gnocchi'>,
  {
    id: 'trip-tick',
    url: 'https://trip-tick.biscuits.club',
    name: 'Trip Tick',
    description: 'The smartest packing list for your next trip',
    iconPath: 'icon.png',
    size: 2,
    devOriginOverride: 'http://localhost:6221',
    demoVideoSrc: '/videos/trip-tick.mp4',
    paidFeatures: [
      {
        imageUrl: '/images/trip-tick/weather.png',
        description:
          'Get weather forecasts for your destination and the duration of your trip.',
      },
    ],
    paidDescription:
      'Now everyone can be on the same page when packing. Plus, get a weather forecast and more powerful trip planning tools.',
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

export function getAppUrl(app: AppManifest<AppId>) {
  if (import.meta.env.DEV) {
    return app.devOriginOverride;
  }
  return app.url;
}

declare global {
  interface ImportMetaEnv {
    DEV: boolean;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
