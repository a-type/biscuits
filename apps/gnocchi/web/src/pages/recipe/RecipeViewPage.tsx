import { PageContent } from '@a-type/ui';
import { Outlet } from '@verdant-web/react-router';

export interface RecipeViewPageProps {}

export function RecipeViewPage({}: RecipeViewPageProps) {
	return (
		<PageContent>
			<Outlet />
		</PageContent>
	);
}

export default RecipeViewPage;
