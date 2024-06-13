import { useMe } from './graphql.js';

export const featureFlags = {
  hub: false,
} as const;

export type FeatureFlagName = keyof typeof featureFlags;

export function useFeatureFlag(flag: FeatureFlagName) {
  const result = useMe();
  return (
    featureFlags[flag] || result?.data?.me?.plan?.featureFlags?.includes(flag)
  );
}
