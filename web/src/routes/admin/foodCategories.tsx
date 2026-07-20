import AdminFoodCategoriesPage from '@/pages/admin/AdminFoodCategoriesPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/foodCategories')({
	component: AdminFoodCategoriesPage,
});
