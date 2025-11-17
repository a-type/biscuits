import { createFileRoute } from '@tanstack/react-router';
import { PublicationPage } from '~/components/PublicationPage.js';
import { fetchPublication } from '~/utils/fetchPublication.js';

export const Route = createFileRoute('/')({
	component: RouteComponent,
	loader: () => fetchPublication({ data: {} }),
});

function RouteComponent() {
	const data = Route.useLoaderData();
	return <PublicationPage data={data} />;
}
