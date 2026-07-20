import JoinPage from '@/pages/JoinPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/join')({
	component: JoinPage,
});
