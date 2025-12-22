import { hooks } from '@/hooks.js';
import {
	Button,
	CardFooter,
	CardGrid,
	CardMain,
	CardRoot,
	CardTitle,
	DropdownMenu,
	DropdownMenuArrow,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuItemRightSlot,
	DropdownMenuTrigger,
	Icon,
	InfiniteLoadTrigger,
	toast,
} from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { List } from '@wish-wash.biscuits/verdant';
import { FirstList } from '../onboarding/FirstList.jsx';
import { useEditList } from './hooks.js';

export interface ListsListProps {}

export function ListsList({}: ListsListProps) {
	const [items, { hasMore, loadMore }] = hooks.useAllListsInfinite({
		index: {
			where: 'createdAt',
			order: 'desc',
		},
		pageSize: 20,
	});

	if (items.length === 0) {
		return <FirstList />;
	}

	return (
		<>
			<CardGrid>
				{items.map((item, i) => (
					<ListsListItem item={item} key={i} />
				))}
			</CardGrid>
			{hasMore && <InfiniteLoadTrigger onVisible={loadMore} />}
		</>
	);
}

function ListsListItem({ item }: { item: List }) {
	const { name, id } = hooks.useWatch(item);
	return (
		<CardRoot>
			<CardMain asChild>
				<Link to={`/${id}`}>
					<CardTitle className="flex-row gap-2 items-center">
						<Icon name={item.isAuthorized ? 'lock' : 'add_person'} /> {name}
					</CardTitle>
				</Link>
			</CardMain>
			<CardFooter>
				<ListMenu list={item} />
			</CardFooter>
		</CardRoot>
	);
}

function ListMenu({ list }: { list: List }) {
	const editList = useEditList();
	const client = hooks.useClient();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button emphasis="ghost">
					<Icon name="dots" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuArrow />
				<DropdownMenuItem onClick={() => editList(list.get('id'))}>
					Edit list
					<DropdownMenuItemRightSlot>
						<Icon name="pencil" />
					</DropdownMenuItemRightSlot>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={async () => {
						await client
							.batch()
							.run(() => {
								list.deleteSelf();
							})
							.commit();
						const t = toast.success(
							<div className="row">
								List deleted
								<Button
									size="small"
									onClick={() => {
										client.undoHistory.undo();
										toast.close(t);
									}}
								>
									Undo
								</Button>
							</div>,
						);
					}}
					color="attention"
				>
					Delete list
					<DropdownMenuItemRightSlot>
						<Icon name="trash" />
					</DropdownMenuItemRightSlot>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
