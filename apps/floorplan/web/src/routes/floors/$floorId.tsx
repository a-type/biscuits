import FloorPage from '@/pages/FloorPage.jsx';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/floors/$floorId')({
	component: FloorPage,
});
