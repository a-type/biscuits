import AdminPlansPage from '@/pages/admin/AdminPlansPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/plans')({
	component: AdminPlansPage,
});
