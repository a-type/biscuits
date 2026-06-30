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
import { ReactElement } from 'react';

export function TagManager({
	children,
	onClose,
}: {
	children: ReactElement;
	onClose?: () => void;
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
			onOpenChange={(open) => {
				if (!open) onClose?.();
			}}
		>
			<Dialog.Trigger render={children} />
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
								<div className="flex-1 text-md">{tag.get('name')}</div>
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
				<div style={{ marginTop: 16 }}>
					<FormikForm
						initialValues={{ tagName: '' }}
						onSubmit={(values) => {
							createTag(values.tagName);
						}}
					>
						<Box gap="sm" items="center">
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
