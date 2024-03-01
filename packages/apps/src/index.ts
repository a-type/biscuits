export type AppManifest = {
  id: string;
  name: string;
  description: string;
  mainImageUrl: string;
  size: number;
  url: string;
};

export const apps: AppManifest[] = [
  {
    id: 'gnocchi',
    name: 'Gnocchi',
    description: "Maybe you're cooking every week and want to get organized",
    mainImageUrl: 'https://gnocchi.club/og-image.png',
    size: 4,
    url: 'https://gnocchi.club',
  },
];
