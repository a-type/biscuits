import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	ActionBar,
	Box,
	Button,
	Dialog,
	Divider,
	FormikForm,
	Icon,
	TextField,
} from '@a-type/ui';
import { ColorPicker } from '@biscuits/client';

export function TagManager({
	onClose,
	open,
}: {
	onClose?: () => void;
	open?: boolean;
}) {
	const tags = hooks.useAllRecipeTagMetadata().sort((a, b) => {
		return a.get('name').localeCompare(b.get('name'));
	});

	const client = hooks.useClient();
	const deleteTag = (tagName: string) => {
		client.recipeTagMetadata.delete(tagName);
	};
	const createTag = (tagName: string) => {
		client.recipeTagMetadata.put({
			name: tagName,
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) onClose?.();
			}}
		>
			<Dialog.Content>
				<ActionBar>
					<UndoAction />
				</ActionBar>
				<Box col gap="sm" grow overflow="auto-y" style={{ minHeight: 0 }}>
					{tags.map((tag) => (
						<>
							<Box
								key={tag.get('name')}
								gap="sm"
								items="center"
								style={{ flexShrink: 0 }}
							>
								<ColorPicker
									onValueChange={(color) => tag.set('color', color)}
									value={tag.get('color') ?? null}
								/>
								<Box grow>{tag.get('name')}</Box>
								<Button
									color="attention"
									emphasis="ghost"
									onClick={() => deleteTag(tag.get('name'))}
								>
									<Icon name="trash" />
								</Button>
							</Box>
							<Divider />
						</>
					))}
				</Box>
				<div style={{ marginTop: 16, width: '100%' }}>
					<FormikForm
						initialValues={{ tagName: '' }}
						onSubmit={(values) => {
							createTag(values.tagName);
						}}
						className="w-full"
					>
						<Box gap="sm" items="end" full="width">
							<TextField
								style={{ minWidth: 64, flex: 1 }}
								name="tagName"
								label="New Tag Name"
							/>
							<Button type="submit" emphasis="primary">
								Create
							</Button>
						</Box>
					</FormikForm>
				</div>
				<Dialog.Actions>
					<Dialog.Close>Done</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
