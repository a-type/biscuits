import LoginPage from '@/pages/LoginPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
	component: LoginPage,
});
