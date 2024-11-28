import { hooks } from '@/store.js';
import {
	Button,
	DropdownMenu,
	DropdownMenuArrow,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon,
	toast,
} from '@a-type/ui';
import { List } from '@trip-tick.biscuits/verdant';
import { useNavigate } from '@verdant-web/react-router';

export function ListMenu({ list }: { list: List }) {
	const client = hooks.useClient();
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" color="ghost">
					<Icon name="dots" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuArrow />
				<DropdownMenuItem
					className="text-red"
					onClick={() => {
						client.lists.delete(list.get('id'));
						navigate('/');
						toast((t) => (
							<span className="flex gap-2 items-center">
								<Icon name="check" />
								<span>List deleted!</span>
								<Button
									size="small"
									onClick={() => {
										client.undoHistory.undo();
										toast.dismiss(t.id);
									}}
								>
									Undo
								</Button>
							</span>
						));
					}}
				>
					Delete list
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
