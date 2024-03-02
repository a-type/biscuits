export function getLibraryName(planId: string, app: string) {
  return `${planId}__${app}`;
}

export function parseLibraryName(libraryName: string): {
  planId: string;
  app: string;
} {
  const [planId, app] = libraryName.split('__');
  return { planId, app };
}

export type BiscuitsVerdantProfile = {
  id: string;
  name: string;
  imageUrl: string | null;
};
