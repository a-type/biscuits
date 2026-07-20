import ProjectPage from '@/pages/ProjectPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$id')({
	component: ProjectPage,
});
