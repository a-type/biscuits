import PantryPage from '@/pages/pantry/PantryPage.jsx';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';

export const Route = createFileRoute('/pantry')({
	component: PantryPage,
	validateSearch: zodValidator(
		z.object({
			filter: z.enum(['all', 'purchased', 'frozen']).optional(),
			query: z.string().optional(),
		}),
	),
});
