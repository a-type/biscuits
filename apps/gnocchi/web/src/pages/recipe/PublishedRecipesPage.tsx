import { PublicationDetails } from '@/components/recipes/publication/PublicationDetails.jsx';
import { PublishedRecipes } from '@/components/recipes/publication/PublishedRecipes.jsx';
import { Box, ErrorBoundary, H2, PageContent } from '@a-type/ui';
import { RestoreScroll } from '@verdant-web/react-router';
import { Suspense } from 'react';

const PublishedRecipesPage = () => {
	return (
		<>
			<PageContent>
				<ErrorBoundary>
					<PublicationDetails color="primary" surface p />
				</ErrorBoundary>
				<H2>Published Recipes</H2>
				<ErrorBoundary
					fallback={
						<Box p layout="center center">
							<p>Failed to load published recipes.</p>
						</Box>
					}
				>
					<Suspense>
						<PublishedRecipes />
					</Suspense>
				</ErrorBoundary>
			</PageContent>
			<RestoreScroll />
		</>
	);
};

export default PublishedRecipesPage;
