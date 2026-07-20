import BackToAppPage from '@/pages/BackToAppPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/return-to-app')({
	component: BackToAppPage,
});
