import { UndoAction } from '@/components/groceries/actions/UndoAction.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	ActionBar,
	Button,
	ColorPicker,
	Dialog,
	Divider,
	FormikForm,
	PaletteName,
	TextField,
} from '@a-type/ui';
import { TrashIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
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
				<div className="flex flex-col gap-2 overflow-y-auto min-h-0 flex-1">
					{tags.map((tag) => (
						<>
							<div
								key={tag.get('name')}
								className={classNames(
									'flex flex-row gap-2 items-center flex-shrink-0',
								)}
							>
								<ColorPicker
									onChange={(color) => tag.set('color', color)}
									value={tag.get('color') as PaletteName}
								/>
								<div className="flex-1 text-md">{tag.get('name')}</div>
								<Button
									color="attention"
									emphasis="ghost"
									onClick={() => deleteTag(tag.get('name'))}
								>
									<TrashIcon />
								</Button>
							</div>
							<Divider className="opacity-50" />
						</>
					))}
				</div>
				<div className="mt-4">
					<FormikForm
						initialValues={{ tagName: '' }}
						onSubmit={(values) => {
							createTag(values.tagName);
						}}
						className="flex flex-row gap-2 items-end"
					>
						<TextField
							className="flex-1 min-w-64px"
							name="tagName"
							label="New Tag Name"
						/>
						<Button type="submit" emphasis="primary">
							Create
						</Button>
					</FormikForm>
				</div>
				<Dialog.Actions>
					<Dialog.Close>Done</Dialog.Close>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
