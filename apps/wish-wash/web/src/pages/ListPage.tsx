import { ListActions } from '@/components/lists/ListActions.jsx';
import { ListHero } from '@/components/lists/ListHero.jsx';
import { ListView } from '@/components/lists/ListView.jsx';
import { SyncPurchases } from '@/components/lists/SyncPurchases.jsx';
import { hooks } from '@/hooks.js';
import { Box, Button, H1, Icon, PageContent, PageRoot } from '@a-type/ui';
import { Link, useLocalStorage } from '@biscuits/client';

import { UserMenu } from '@biscuits/client/apps';

import { useNavigate, useParams } from '@tanstack/react-router';
import { List } from '@wish-wash.biscuits/verdant';
import { useEffect } from 'react';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
	const { listId } = useParams({ from: '/$listId' });
	const [_, setLastList] = useLocalStorage<string | null>('last-list', null);

	const list = hooks.useList(listId);
	const navigate = useNavigate();

	useEffect(() => {
		setLastList(listId);
	}, [listId, setLastList]);
	const hasList = !!list;
	useEffect(() => {
		if (!hasList) {
			setLastList(null);
			navigate({ to: '/' });
		}
	}, [hasList, navigate, setLastList]);

	if (!list) {
		return (
			<PageRoot>
				<PageContent>
					<H1>List not found</H1>
					<Button render={<Link to="/" />}>Go back</Button>
				</PageContent>
			</PageRoot>
		);
	}

	return <ListPageContent list={list} />;
}

function ListPageContent({ list }: { list: List }) {
	return (
		<Box col full p gap="lg" items="center">
			<Box
				gap
				justify="between"
				items="center"
				full="width"
				p="sm"
				surface
				style={{
					position: 'sticky',
					top: 0,
					zIndex: 100,
					maxWidth: '800px',
				}}
			>
				<Button emphasis="ghost" render={<Link to="/" />}>
					<Icon name="arrowLeft" />
					Home
				</Button>
				<UserMenu />
			</Box>
			<Box col gap full="width" style={{ maxWidth: '800px' }}>
				<ListHero list={list} />
				<SyncPurchases list={list} />
				<ListActions
					style={{
						position: 'sticky',
						top: 0,
						zIndex: 10,
					}}
					list={list}
				/>
			</Box>
			<ListView
				list={list}
				style={{
					maxWidth: '1280px',
					width: '100%',
					paddingBottom: '200px',
				}}
			/>
		</Box>
	);
}

export default ListPage;
