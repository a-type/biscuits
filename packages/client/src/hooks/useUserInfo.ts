import { graphql, useSuspenseQuery } from '@biscuits/graphql';

const userInfoQuery = graphql(`
	query UserInfo($userId: ID!) {
		user(id: $userId) {
			id
			name
			imageUrl
		}
	}
`);

export function useUserInfo(userId: string) {
	const { data } = useSuspenseQuery(userInfoQuery, {
		variables: { userId },
	});

	return data?.user ?? null;
}
