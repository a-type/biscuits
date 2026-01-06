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
import { addToList } from '../lists/add/util.js';
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
	const doAdd = async (listId: string) => {
		if (!share) return;
		const list = lists.find((list) => list.get('id') === listId);
		if (!list) return;

		const itemId = addToList(list, {
			description: share.title || share.text || 'Shared item',
			links: share.url ? [share.url] : [],
			type: share.url ? 'link' : 'idea',
		});
		navigate(`/${listId}?itemId=${itemId}`);
		shareTargetState.share = null;
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
				<DialogSelectList
					onValueChange={(v) => (v ? doAdd(v as string) : null)}
				>
					{lists.map((list) => (
						<DialogSelectItem
							value={list.get('id')}
							key={list.get('id')}
							className="[&>span]:(flex flex-row items-center gap-md)"
						>
							<Icon name={list.isAuthorized ? 'lock' : 'add_person'} />
							{list.get('name')}
						</DialogSelectItem>
					))}
				</DialogSelectList>
			</DialogContent>
		</Dialog>
	);
}
