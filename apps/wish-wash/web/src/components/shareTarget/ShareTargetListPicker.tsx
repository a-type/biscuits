import { hooks } from '@/hooks.js';
import {
	Dialog,
	DialogContent,
	DialogSelectItem,
	DialogSelectList,
	DialogTitle,
	Icon,
} from '@a-type/ui';
import { useNavigate } from '@verdant-web/react-router';
import { useSnapshot } from 'valtio';
import { shareTargetState } from './shareTargetState.js';

export interface ShareTargetListPickerProps {}

export function ShareTargetListPicker({}: ShareTargetListPickerProps) {
	const share = useSnapshot(shareTargetState).share;
	const lists =
		hooks.useAllLists({
			skip: !share,
		}) || [];

	const show = !!share;

	const navigate = useNavigate();
	const addToList = async (listId: string) => {
		if (!share) return;
		const list = lists.find((list) => list.get('id') === listId);
		if (!list) return;

		// TODO: scan webpage for subscribers

		const items = list.get('items');
		items.push({
			links: share.url ? [share.url] : undefined,
			description: share.title || share.text,
		});
		navigate(`/${listId}`);
	};

	return (
		<Dialog
			open={show}
			onOpenChange={(open) => {
				if (!open) {
					shareTargetState.share = null;
				}
			}}
		>
			<DialogContent>
				<DialogTitle>Add to list</DialogTitle>
				<DialogSelectList onValueChange={addToList}>
					{lists.map((list) => (
						<DialogSelectItem value={list.get('id')} key={list.get('id')}>
							<Icon name={list.isAuthorized ? 'lock' : 'add_person'} />
							{list.get('name')}
						</DialogSelectItem>
					))}
				</DialogSelectList>
			</DialogContent>
		</Dialog>
	);
}
