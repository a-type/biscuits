import PantryListPage from '@/pages/pantry/PantryListPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pantry/')({
	component: PantryListPage,
});
