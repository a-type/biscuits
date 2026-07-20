import AdminChangelogsPage from '@/pages/admin/AdminChangelogsPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/changelogs')({
	component: AdminChangelogsPage,
});
