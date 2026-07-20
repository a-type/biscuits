import ResetPasswordPage from '@/pages/ResetPasswordPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reset-password')({
	component: ResetPasswordPage,
});
