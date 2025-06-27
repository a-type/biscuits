import { ListEditor } from '@/components/lists/ListEditor.jsx';
import { ListMenu } from '@/components/lists/ListMenu.jsx';
import { hooks } from '@/store.js';
import { Button, Icon, PageContent, PageFixedArea } from '@a-type/ui';
import { usePageTitle } from '@biscuits/client';
import { AutoRestoreScroll, Link, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
	const params = useParams();
	const listId = params.listId;

	return (
		<PageContent>
			<Suspense>
				<ListPageEditor listId={listId} />
			</Suspense>
			<AutoRestoreScroll />
		</PageContent>
	);
}

function ListPageEditor({ listId }: { listId: string }) {
	const list = hooks.useList(listId);
	usePageTitle(list?.get('name') ?? 'List');

	if (!list) {
		return <div>List not found</div>;
	}

	return (
		<PageContent p="none">
			<PageFixedArea className="!row justify-between w-full py-3">
				<Button asChild color="ghost" size="icon">
					<Link to="/">
						<Icon name="arrowLeft" />
						<span className="sr-only">Back to lists</span>
					</Link>
				</Button>
				<ListMenu list={list} />
			</PageFixedArea>
			<ListEditor list={list} />
		</PageContent>
	);
}

export default ListPage;
