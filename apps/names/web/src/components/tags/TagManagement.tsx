import { hooks, useDeleteTag } from '@/hooks.js';
import {
	Box,
	Button,
	ColorPicker,
	Dialog,
	Icon,
	SlotDiv,
	ThemeName,
} from '@a-type/ui';
import { Tag } from '@names.biscuits/verdant';
import { ReactNode, Suspense } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { TagDisplay } from './TagDisplay.jsx';

export interface TagManagementProps {}

const state = proxy({
	open: false,
});

export function TagManagementTrigger({ children }: { children: ReactNode }) {
	return (
		<SlotDiv onClick={() => (state.open = true)} asChild>
			{children}
		</SlotDiv>
	);
}

export function TagManagement({}: TagManagementProps) {
	const tags = hooks.useAllTags();
	const { open } = useSnapshot(state);

	return (
		<Dialog open={open} onOpenChange={(v) => (state.open = v)}>
			<Dialog.Content>
				<Dialog.Title>Manage Tags</Dialog.Title>
				<Box className="w-full" gap d="col">
					{tags.map((tag) => (
						<Suspense>
							<TagManagementRow tag={tag} />
						</Suspense>
					))}
				</Box>
				<Dialog.Actions>
					<Dialog.Close />
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}

function TagManagementRow({ tag }: { tag: Tag }) {
	const { name, color } = hooks.useWatch(tag);
	const deleteTag = useDeleteTag();
	const deleteSelf = () => deleteTag(name);

	return (
		<Box key={tag.uid} className="w-full" gap justify="between" items="center">
			<Box gap>
				<ColorPicker
					value={(color ?? 'leek') as ThemeName}
					onChange={(v) => tag.set('color', v)}
				/>
				<TagDisplay name={tag.get('name')} />
			</Box>
			<Button color="ghostDestructive" onClick={deleteSelf} size="icon">
				<Icon name="trash" />
			</Button>
		</Box>
	);
}
