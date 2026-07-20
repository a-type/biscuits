import PreviewRequestPage from '@/pages/PreviewRequestPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/preview-request')({
	component: PreviewRequestPage,
});
