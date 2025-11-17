import { createFileRoute } from '@tanstack/react-router';
import { PublicationPage } from '~/components/PublicationPage.js';
import { fetchPublication } from '~/utils/fetchPublication.js';

export const Route = createFileRoute('/p/$planId/')({
	component: RouteComponent,
	loader: ({ params }) =>
		fetchPublication({
			data: {
				planId: params.planId,
			},
		}),
});

function RouteComponent() {
	const data = Route.useLoaderData();
	return <PublicationPage data={data} />;
}
