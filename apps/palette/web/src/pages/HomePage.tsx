import { CreateProject } from '@/components/projects/CreateProject.jsx';
import { ProjectsList } from '@/components/projects/ProjectsList.jsx';
import { PageContent, PageFixedArea } from '@a-type/ui/components/layouts';
import { usePageTitle, UserMenu } from '@biscuits/client';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
	usePageTitle('Palette');
	return (
		<PageContent>
			<PageFixedArea>
				<div className="row">
					<h1>Palette</h1>
					<UserMenu className="ml-auto" />
				</div>
			</PageFixedArea>
			<ProjectsList />
			<CreateProject />
		</PageContent>
	);
}

export default HomePage;
