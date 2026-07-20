import TripsPage from '@/pages/TripsPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: TripsPage,
});
