import PrivacyPage from '@/pages/PrivacyPage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy')({
	component: PrivacyPage,
});
