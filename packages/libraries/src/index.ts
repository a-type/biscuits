export type LibraryAccess = 'members' | 'user';

export function getLibraryName({
  planId,
  app,
  access,
  userId,
}: {
  planId: string;
  app: string;
  access: LibraryAccess;
  userId: string;
}) {
  if (access === 'user') {
    return `${planId}__${app}__${userId}`;
  }
  return `${planId}__${app}`;
}

export function parseLibraryName(libraryName: string): {
  planId: string;
  app: string;
  maybeUserId?: string;
} {
  const [planId, app, maybeUserId] = libraryName.split('__');
  return { planId, app, maybeUserId };
}

export type BiscuitsVerdantProfile = {
  id: string;
  name: string;
  imageUrl: string | null;
};
