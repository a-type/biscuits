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
	Icon,
} from '@a-type/ui';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ListItemsItem } from '@trip-tick.biscuits/verdant';
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
	const search = useSearch({ strict: false }) as Record<string, string>;
	const navigate = useNavigate();
	const open = search.item === id;
	const onClose = () =>
		navigate({
			replace: true,
			search: (prev) => ({ ...prev, item: undefined }) as never,
		});
	const onOpen = () =>
		navigate({
			replace: true,
			search: (prev) => ({ ...prev, item: id }) as never,
		});

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
				else onOpen();
			}}
		>
			<CardRoot>
				<Dialog.Trigger render={<CardMain />}>
					<CardTitle>{description}</CardTitle>
					<CardContent>{shortString}</CardContent>
				</Dialog.Trigger>
				<CardFooter>
					<CardActions>
						<Button color="attention" emphasis="ghost" onClick={onDelete}>
							<Icon name="trash" />
						</Button>
					</CardActions>
				</CardFooter>
			</CardRoot>
			<Dialog.Content>
				<Dialog.Title>Edit item</Dialog.Title>
				<ListItemEditor item={item} />
				<Dialog.Actions>
					<Dialog.Close>Done</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
