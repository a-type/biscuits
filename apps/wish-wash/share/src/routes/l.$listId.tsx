import { createFileRoute } from '@tanstack/react-router';
import { ListPage } from '~/components/ListPage.js';
import { fetchList } from '~/utils/fetchList.js';

export const Route = createFileRoute('/l/$listId')({
	component: RouteComponent,
	loader: ({ params }) => fetchList({ data: params.listId }),
});

function RouteComponent() {
	const data = Route.useLoaderData();
	return <ListPage data={data} />;
}
