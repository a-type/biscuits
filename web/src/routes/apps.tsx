import AppsPage from '@/pages/AppsPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/apps')({
	component: AppsPage,
});
