import { hooks } from '@/hooks.js';
import {
	Box,
	EditableText,
	ErrorBoundary,
	Icon,
	ImageUploader,
} from '@a-type/ui';
import { Notebook } from '@post.biscuits/verdant';
import { NotebookIconEditor } from './NotebookIconEditor.jsx';
import { NotebookSettingsMenu } from './NotebookSettingsMenu.jsx';

export interface NotebookDetailsEditorProps {
	notebook: Notebook;
}

export function NotebookDetailsEditor({
	notebook,
}: NotebookDetailsEditorProps) {
	const { name, coverImage, icon } = hooks.useWatch(notebook);
	hooks.useWatch(coverImage);
	hooks.useWatch(icon);

	return (
		<Box container surface p className="min-h-25vh">
			<div className="absolute inset-0 bg-primary-wash rounded-lg overflow-hidden">
				{coverImage?.url && (
					<img
						src={coverImage.url}
						alt=""
						className="w-full h-full object-cover"
					/>
				)}
			</div>
			<Box gap="sm" className="absolute top-0 right-0 z-11" p>
				<ErrorBoundary fallback={null}>
					<NotebookSettingsMenu notebook={notebook} />
				</ErrorBoundary>
			</Box>
			<Box gap="sm" className="absolute bottom-0 right-0 z-11" p>
				<ImageUploader.Root
					value={null}
					onChange={(file) => notebook.set('coverImage', file)}
					className="w-32px h-32px"
				>
					<ImageUploader.EmptyControls>
						<ImageUploader.FileButton>
							<Icon name="camera" />
						</ImageUploader.FileButton>
					</ImageUploader.EmptyControls>
				</ImageUploader.Root>
			</Box>
			<Box className="relative z-10 mt-auto w-full" d="col" gap items="start">
				<NotebookIconEditor notebook={notebook} className="w-80px" />
				<EditableText
					value={name}
					onValueChange={(name) => notebook.set('name', name)}
					className="text-xl bg-wash w-auto [input&]:w-full"
					autoSelect
				/>
			</Box>
		</Box>
	);
}
