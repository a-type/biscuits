import { SuperBar } from '@/components/superBar/SuperBar.jsx';
import { SuperBarCreate } from '@/components/superBar/SuperBarCreate.jsx';
import { SuperBarSuggestions } from '@/components/superBar/SuperBarSuggestions.jsx';
import { P, PageContent, PageRoot } from '@a-type/ui';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	return (
		<PageRoot>
			<PageContent>
				<P>Search for people or add a new name</P>
				<SuperBar />
				<SuperBarSuggestions />
				<SuperBarCreate />
			</PageContent>
		</PageRoot>
	);
}

export default HomePage;
