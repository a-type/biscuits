import PersonPage from '@/pages/PersonPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/people/$id')({
	component: PersonPage,
});
