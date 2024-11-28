import { PageContent } from '@a-type/ui';
import { Outlet } from '@verdant-web/react-router';

export interface RecipeViewPageProps {}

export function RecipeViewPage({}: RecipeViewPageProps) {
	return (
		<PageContent className="rounded-b-lg border-b border-b-solid border-b-[#00000070] bg-wash sm:border-none sm:rounded-0">
			<Outlet />
		</PageContent>
	);
}

export default RecipeViewPage;
