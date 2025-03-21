import { ReactNode } from 'react';
import { FeatureFlagName, useFeatureFlag } from '../featureFlags.js';

export interface FeatureFlagProps {
	children: ReactNode;
	flag: FeatureFlagName;
}

export function FeatureFlag({ flag, children }: FeatureFlagProps) {
	const enabled = useFeatureFlag(flag);
	return enabled ? <>{children}</> : null;
}
