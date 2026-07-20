import GnocchiPage from '@/pages/promos/GnocchiPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/gnocchi')({
	component: GnocchiPage,
});
