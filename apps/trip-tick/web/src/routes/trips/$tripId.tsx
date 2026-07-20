import TripPage from '@/pages/TripPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trips/$tripId')({
	component: TripPage,
});
