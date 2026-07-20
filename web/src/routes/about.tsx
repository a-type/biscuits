import AboutPage from '@/pages/AboutPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
	component: AboutPage,
});
