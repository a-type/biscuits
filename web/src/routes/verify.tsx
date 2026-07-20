import VerifyPage from '@/pages/VerifyPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/verify')({
	component: VerifyPage,
});
