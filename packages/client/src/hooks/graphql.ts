import { useMaybeAppId } from '../components/Context.js';
import {
	ApolloError,
	graphql,
	NetworkStatus,
	useQuery,
} from '@biscuits/graphql';
import { useEffect } from 'react';

// some minimal queries for common use
const meQuery = graphql(`
	query CommonMe($appId: String!) {
		me {
			id
			name
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
	const result = useMe();
	return [
		!!result.data?.me?.id,
		result.networkStatus === NetworkStatus.loading ||
			result.networkStatus === NetworkStatus.refetch ||
			isOfflineError(result.error),
	] as const;
}

export function useHasServerAccess() {
	const result = useMe();
	return result?.data?.me?.plan?.hasAppAccess;
}

export function useIsOffline() {
	const { error } = useMe();
	return isOfflineError(error);
}

function isOfflineError(error: ApolloError | undefined) {
	if (!error) return false;
	if (!error.networkError) return false;
	if (error.networkError.message === 'Failed to fetch') return true;
	if ('statusCode' in error.networkError) {
		return (
			error.networkError.statusCode === 0 ||
			error.networkError.statusCode >= 500
		);
	}
	return false;
}
