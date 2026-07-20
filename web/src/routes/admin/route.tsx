import AdminPage from '@/pages/admin/AdminPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
	component: AdminPage,
});
