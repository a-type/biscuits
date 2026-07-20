import AdminFoodsPage from '@/pages/admin/AdminFoodsPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/foods')({
	component: AdminFoodsPage,
});
