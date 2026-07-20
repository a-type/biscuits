import TermsPage from '@/pages/TermsPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tos')({
	component: TermsPage,
});
