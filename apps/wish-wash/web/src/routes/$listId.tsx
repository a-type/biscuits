import ListPage from '@/pages/ListPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$listId')({
	component: ListPage,
});
