import { ListEditor } from '@/components/lists/ListEditor.jsx';
import { ListMenu } from '@/components/lists/ListMenu.jsx';
import { hooks } from '@/store.js';
import { Box, Button, Icon, PageContent, PageFixedArea } from '@a-type/ui';
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
			<Box
				full="width"
				justify="between"
				gap
				render={<PageFixedArea style={{ flexDirection: 'row' }} />}
			>
				<Button
					render={<Link to="/" />}
					aria-label="Back to lists"
					emphasis="ghost"
				>
					<Icon name="arrowLeft" />
				</Button>
				<ListMenu list={list} />
			</Box>
			<ListEditor list={list} />
		</PageContent>
	);
}

export default ListPage;
