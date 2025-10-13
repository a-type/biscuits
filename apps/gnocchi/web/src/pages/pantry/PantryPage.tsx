import { PantryActionBar } from '@/components/pantry/actions/PantryActionBar.jsx';
import { PantrySearch } from '@/components/pantry/search/PantrySearch.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { PageContent, PageFixedArea } from '@a-type/ui';
import { Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';

export interface PantryPageProps {}

export function PantryPage({}: PantryPageProps) {
	usePageTitle('Pantry');

	return (
		<PageContent gap="sm">
			<PantrySearch />
			<PageFixedArea>
				<PantryActionBar />
			</PageFixedArea>
			<Suspense>
				<Outlet />
			</Suspense>
		</PageContent>
	);
}

export default PantryPage;
