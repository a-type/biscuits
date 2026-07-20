import HomePage from '@/pages/HomePage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: HomePage,
});
