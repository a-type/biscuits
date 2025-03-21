import { ReactNode } from 'react';
import { useHasServerAccess } from '../hooks/graphql.js';

export interface GateProps {
	children?: ReactNode;
}

export function SubscribedOnly({ children }: GateProps) {
	const isSubscribed = useHasServerAccess();

	if (!isSubscribed) {
		return null;
	}

	return <>{children}</>;
}

export function UnsubscribedOnly({ children }: GateProps) {
	const isSubscribed = useHasServerAccess();

	if (isSubscribed) {
		return null;
	}

	return <>{children}</>;
}
