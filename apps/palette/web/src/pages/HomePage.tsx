import { CreateProject } from '@/components/projects/CreateProject.jsx';
import { ProjectsList } from '@/components/projects/ProjectsList.jsx';
import { basicsOnboarding } from '@/onboarding/basics.js';
import { Box, PageContent, PageFixedArea } from '@a-type/ui';
import { OnboardingBanner, usePageTitle } from '@biscuits/client';
import { UserMenu } from '@biscuits/client/apps';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	usePageTitle('Home');
	return (
		<PageContent>
			<PageFixedArea>
				<Box justify="between" items="center" p="xs">
					<h1>Palette</h1>
					<UserMenu />
				</Box>
			</PageFixedArea>
			<OnboardingBanner
				onboarding={basicsOnboarding}
				step="intro"
				style={{
					marginInline: 'auto',
					marginBottom: 'var(--m-sp)',
					maxWidth: 400,
				}}
			>
				Palette is a painting tool which helps you analyze colors in reference
				photos. Add an image to start a new project.
			</OnboardingBanner>
			<ProjectsList />
			<CreateProject />
		</PageContent>
	);
}

export default HomePage;
