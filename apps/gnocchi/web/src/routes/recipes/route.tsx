import { verdant } from '@/stores/groceries/index.js';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/recipes')({
	component: () => <Outlet />,
	// keep main recipe query alive as long as the user is in /recipes
	onEnter() {
		verdant.queries.keepAlive('recipes');
		verdant.queries.keepAlive('pinnedRecipes');
		verdant.queries.keepAlive('allRecipeTags');
	},
	onLeave() {
		verdant.queries.dropKeepAlive('recipes');
		verdant.queries.dropKeepAlive('pinnedRecipes');
		verdant.queries.dropKeepAlive('allRecipeTags');
	},
});
