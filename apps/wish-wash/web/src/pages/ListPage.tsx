import { ListActions } from '@/components/lists/ListActions.jsx';
import { ListHero } from '@/components/lists/ListHero.jsx';
import { ListView } from '@/components/lists/ListView.jsx';
import { hooks } from '@/hooks.js';
import { Box, Button, H1, Icon, PageContent, PageRoot } from '@a-type/ui';
import { useLocalStorage } from '@biscuits/client';
import { UserMenu } from '@biscuits/client/apps';
import { Link, useNavigate, useParams } from '@verdant-web/react-router';
import { List } from '@wish-wash.biscuits/verdant';
import { useEffect } from 'react';

export interface ListPageProps {}

export function ListPage({}: ListPageProps) {
	const { listId } = useParams();
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
			navigate('/');
		}
	}, [hasList, navigate, setLastList]);

	if (!list) {
		return (
			<PageRoot>
				<PageContent>
					<H1>List not found</H1>
					<Button asChild>
						<Link to="/">Go back</Link>
					</Button>
				</PageContent>
			</PageRoot>
		);
	}

	return <ListPageContent list={list} />;
}

function ListPageContent({ list }: { list: List }) {
	return (
		<Box d="col" full p gap="lg" items="center">
			<Box
				gap
				justify="between"
				items="center"
				className="sticky py-sm top-0 z-[10000] bg-wash w-full max-w-800px"
			>
				<Button asChild color="ghost">
					<Link to="/">
						<Icon name="arrowLeft" />
						Home
					</Link>
				</Button>
				<UserMenu />
			</Box>
			<Box d="col" gap className="w-full max-w-800px">
				<ListHero list={list} />
				<ListActions className="sticky top-0 z-10" listId={list.get('id')} />
			</Box>
			<ListView list={list} className="pb-[200px] w-full max-w-1690px" />
		</Box>
	);
}

export default ListPage;
