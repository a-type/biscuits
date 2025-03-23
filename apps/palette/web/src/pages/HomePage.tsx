import { CreateProject } from '@/components/projects/CreateProject.jsx';
import { ProjectsList } from '@/components/projects/ProjectsList.jsx';
import { basicsOnboarding } from '@/onboarding/basics.js';
import { PageContent, PageFixedArea } from '@a-type/ui';
import { OnboardingBanner, usePageTitle } from '@biscuits/client';
import { UserMenu } from '@biscuits/client/apps';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	usePageTitle('Home');
	return (
		<PageContent>
			<PageFixedArea>
				<div className="row">
					<h1>Palette</h1>
					<UserMenu className="ml-auto" />
				</div>
			</PageFixedArea>
			<OnboardingBanner
				onboarding={basicsOnboarding}
				step="intro"
				className="max-w-400px mx-auto mb-4"
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
