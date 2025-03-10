import { ListActions } from '@/components/lists/ListActions.jsx';
import { ListDetailsEditButton } from '@/components/lists/ListDetailsDialog.jsx';
import { ListHero } from '@/components/lists/ListHero.jsx';
import { ListView } from '@/components/lists/ListView.jsx';
import { hooks } from '@/hooks.js';
import { Button, H1, Icon, PageContent } from '@a-type/ui';
import { useLocalStorage, UserMenu } from '@biscuits/client';
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
	useEffect(() => {
		if (!list) {
			setLastList(null);
			navigate('/');
		}
	}, [!!list, setLastList]);

	const client = hooks.useClient();

	if (!list) {
		return (
			<PageContent>
				<H1>List not found</H1>
				<Button asChild>
					<Link to="/">Go back</Link>
				</Button>
			</PageContent>
		);
	}

	return <ListPageContent list={list} />;
}

function ListPageContent({ list }: { list: List }) {
	return (
		<div className="w-full h-full p-4 gap-4 flex flex-col">
			<div className="row -ml-3">
				<Button asChild size="small" color="ghost">
					<Link to="/">
						<Icon name="arrowLeft" />
						Home
					</Link>
				</Button>
				<UserMenu
					className="ml-auto my-auto"
					extraItems={
						<ListDetailsEditButton
							listId={list.get('id')}
							key="list-details-edit"
						/>
					}
				/>
			</div>
			<ListHero list={list} />
			<ListActions className="sticky top-0 z-10" listId={list.get('id')} />
			<ListView list={list} className="pb-10" />
		</div>
	);
}

export default ListPage;

const innerContentProps = {
	className: 'max-w-1200px',
};
