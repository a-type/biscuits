import { SuperBar } from '@/components/superBar/SuperBar.jsx';
import { SuperBarCreate } from '@/components/superBar/SuperBarCreate.jsx';
import { SuperBarSuggestions } from '@/components/superBar/SuperBarSuggestions.jsx';
import { Box, PageContent, PageNowPlaying, PageRoot } from '@a-type/ui';
import { AppIcon, UserMenu } from '@biscuits/client';
import { Suspense } from 'react';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageRoot>
			<PageContent>
				<Box items="center" justify="between" className="pb-sm">
					<Box items="center" gap="sm">
						<AppIcon className="w-32px h-32px" />
						<h1 className="font-fancy m-0 text-md font-semibold p-0">Names</h1>
					</Box>
					<UserMenu />
				</Box>
				<SuperBarSuggestions />
				<PageNowPlaying
					unstyled
					className="flex items-stretch justify-center overflow-visible"
				>
					<Suspense>
						<SuperBarCreate />
					</Suspense>
					<SuperBar />
				</PageNowPlaying>
			</PageContent>
		</PageRoot>
	);
}

export default HomePage;
