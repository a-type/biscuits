import HomePage from '@/pages/HomePage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: HomePage,
});
