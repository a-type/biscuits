import EntryPage from '@/pages/EntryPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/entry/$date')({
	component: EntryPage,
});
