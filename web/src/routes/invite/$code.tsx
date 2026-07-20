import ClaimInvitePage from '@/pages/ClaimInvitePage.js';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/invite/$code')({
	component: ClaimInvitePage,
});
