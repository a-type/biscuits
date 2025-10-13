import PantrySearchPage from '@/pages/pantry/PantrySearchPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pantry/search')({
	component: PantrySearchPage,
});
