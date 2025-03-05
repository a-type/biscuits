import { hooks } from '@/hooks.js';
import { Box, EditableText, Icon, ImageUploader } from '@a-type/ui';
import { Notebook } from '@post.biscuits/verdant';
import { NotebookPublishControl } from './NotebookPublishControl.jsx';

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
				<NotebookPublishControl notebook={notebook} size="small" />
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
				<ImageUploader.Root
					value={icon?.url ?? null}
					onChange={(file) => notebook.set('icon', file)}
					className="w-64px h-64px"
				>
					<ImageUploader.Display />
					<ImageUploader.EmptyControls className="bg-wash">
						<ImageUploader.FileButton className="w-full h-full items-center justify-center">
							<Icon name="upload" />
						</ImageUploader.FileButton>
					</ImageUploader.EmptyControls>
				</ImageUploader.Root>
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
