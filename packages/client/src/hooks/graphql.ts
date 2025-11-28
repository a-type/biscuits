import {
	ApolloError,
	graphql,
	NetworkStatus,
	useQuery,
} from '@biscuits/graphql';
import { useEffect } from 'react';
import { useMaybeAppId } from '../common/Context.js';

// some minimal queries for common use
const meQuery = graphql(`
	query CommonMe($appId: String!) {
		me {
			id
			name
			imageUrl
			plan {
				id
				hasAppAccess(appId: $appId)
				subscriptionStatus
				featureFlags
			}
			acceptedTermsOfServiceAt
		}
	}
`);

export function useMe() {
	const appId = useMaybeAppId();
	const res = useQuery(meQuery, {
		fetchPolicy: 'cache-first',
		variables: { appId: appId || '' },
		context: { hideErrors: true },
	});

	// setup to refetch on window visible if the query
	// was unsuccessful
	const { refetch, error } = res;
	useEffect(() => {
		if (error) {
			const handler = () => {
				refetch();
			};
			window.addEventListener('visibilitychange', handler);
			return () => {
				window.removeEventListener('visibilitychange', handler);
			};
		}
	}, [refetch, error]);

	return res;
}

export function useIsLoggedIn() {
	const idResult = useUserId();
	return [
		!!idResult.data,
		idResult.networkStatus === NetworkStatus.loading ||
			idResult.networkStatus === NetworkStatus.refetch ||
			isOfflineError(idResult.error),
	] as const;
}

const userIdQuery = graphql(`
	query CommonUserId {
		myId
	}
`)

export function useUserId() {
	return useQuery(userIdQuery, {
		fetchPolicy: 'cache-first',
		context: { hideErrors: true },
	});
}

export function useHasServerAccess() {
	const result = useMe();
	return result?.data?.me?.plan?.hasAppAccess;
}

export function useIsOffline() {
	const { error } = useUserId();
	return isOfflineError(error);
}

function isOfflineError(error: ApolloError | undefined) {
	if (!error) return false;
	if (!error.networkError) return false;
	if (
		// Chrome
		error.networkError.message === 'Failed to fetch' ||
		// FF
		error.networkError.message?.includes('NetworkError when attempting')
	)
		return true;
	if ('statusCode' in error.networkError) {
		return (
			error.networkError.statusCode === 0 ||
			error.networkError.statusCode >= 500
		);
	}
	return false;
}
