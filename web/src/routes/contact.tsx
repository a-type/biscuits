import ContactPage from '@/pages/ContactPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/contact')({
	component: ContactPage,
});
