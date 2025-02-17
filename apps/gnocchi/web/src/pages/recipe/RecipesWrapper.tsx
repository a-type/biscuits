import { hooks } from '@/stores/groceries/index.js';
import { Outlet } from '@verdant-web/react-router';
import { useEffect } from 'react';

export interface RecipesWrapperProps {}

export function RecipesWrapper({}: RecipesWrapperProps) {
	const client = hooks.useClient();
	useEffect(() => {
		client.queries.keepAlive('recipes');
		client.queries.keepAlive('pinnedRecipes');
		client.queries.keepAlive('allRecipeTags');
		return () => {
			client.queries.dropKeepAlive('recipes');
			client.queries.dropKeepAlive('pinnedRecipes');
			client.queries.dropKeepAlive('allRecipeTags');
		};
	}, [client]);

	return <Outlet />;
}

export default RecipesWrapper;
