import SettingsPage from '@/pages/SettingsPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
	component: SettingsPage,
});
