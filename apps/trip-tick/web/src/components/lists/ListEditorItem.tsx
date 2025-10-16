import { hooks } from '@/store.js';
import {
	Button,
	CardActions,
	CardContent,
	CardFooter,
	CardMain,
	CardRoot,
	CardTitle,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	Icon,
} from '@a-type/ui';
import { ListItemsItem } from '@trip-tick.biscuits/verdant';
import { useSearchParams } from '@verdant-web/react-router';
import { ListItemEditor } from './ListItemEditor.jsx';
import { getItemRulesLabel } from './utils.js';

export interface ListEditorItemProps {
	item: ListItemsItem;
	onDelete: () => void;
}

export function ListEditorItem({ item, onDelete }: ListEditorItemProps) {
	const { id, description, conditions } = hooks.useWatch(item);
	hooks.useWatch(conditions);
	const shortString = getItemRulesLabel(item);
	const [params, setParams] = useSearchParams();
	const open = params.get('item') === id;
	const onClose = () =>
		setParams(
			(p) => {
				p.delete('item');
				return p;
			},
			{
				replace: true,
			},
		);
	const onOpen = () =>
		setParams(
			(p) => {
				p.set('item', id);
				return p;
			},
			{
				replace: true,
			},
		);

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
				else onOpen();
			}}
		>
			<CardRoot>
				<DialogTrigger asChild>
					<CardMain>
						<CardTitle>{description}</CardTitle>
						<CardContent>{shortString}</CardContent>
					</CardMain>
				</DialogTrigger>
				<CardFooter>
					<CardActions>
						<Button size="icon" color="ghostDestructive" onClick={onDelete}>
							<Icon name="trash" />
						</Button>
					</CardActions>
				</CardFooter>
			</CardRoot>
			<DialogContent>
				<ListItemEditor item={item} />
				<DialogActions>
					<DialogClose asChild>
						<Button>Done</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
