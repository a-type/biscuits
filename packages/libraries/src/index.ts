export function getLibraryName(planId: string, app: string) {
  return `${planId}__${app}`;
}

export type BiscuitsVerdantProfile = {
  id: string;
  name: string;
  imageUrl: string | null;
};
