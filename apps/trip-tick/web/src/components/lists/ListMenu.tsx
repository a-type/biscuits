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
			<DropdownMenuTrigger render={<Button emphasis="ghost" />}>
				<Icon name="dots" />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuArrow />
				<DropdownMenuItem
					className="text-red"
					onClick={() => {
						client.lists.delete(list.get('id'));
						navigate('/');
						const id = toast.success('List deleted', {
							data: {
								actions: [
									{
										label: 'Undo',
										onClick: () => {
											client.undoHistory.undo();
											toast.update(id, 'List restored', {
												type: 'success',
											});
										},
									},
								],
							},
						});
					}}
				>
					Delete list
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
