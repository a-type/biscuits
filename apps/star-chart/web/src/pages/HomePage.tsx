import { CreateProjectButton } from '@/components/project/CreateProjectButton.jsx';
import { ProjectCanvas } from '@/components/project/ProjectCanvas.jsx';
import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import {
  PageContent,
  PageNowPlaying,
  PageRoot,
} from '@a-type/ui/components/layouts';
import { H1 } from '@a-type/ui/components/typography';
import { Link } from '@verdant-web/react-router';

export interface HomePageProps {}

export function HomePage({}: HomePageProps) {
  const projects = hooks.useAllProjects();

  return (
    <PageRoot>
      <PageContent>
        <H1>Projects</H1>
        <div className="col">
          {projects.map((proj) => (
            <Link to={`/project/${proj.get('id')}`} key={proj.get('id')}>
              {proj.get('name')}
            </Link>
          ))}
        </div>
        <PageNowPlaying unstyled className="row items-center justify-center">
          <CreateProjectButton size="icon" className="shadow-xl">
            <Icon name="plus" />
          </CreateProjectButton>
        </PageNowPlaying>
      </PageContent>
    </PageRoot>
  );
}

export default HomePage;
