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
import { useNavigate } from '@tanstack/react-router';
import { List } from '@trip-tick.biscuits/verdant';

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
					className="@mode-attention"
					onClick={() => {
						client.lists.delete(list.get('id'));
						navigate({ to: '/' });
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
