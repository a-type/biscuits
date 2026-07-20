import TripTickPage from '@/pages/promos/TripTickPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trip-tick')({
	component: TripTickPage,
});
