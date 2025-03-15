import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	clsx,
	Icon,
	ImageUploader,
	Popover,
	Tabs,
} from '@a-type/ui';
import { Notebook } from '@post.biscuits/verdant';
import { EmojiImagePicker } from '../emoji/EmojiImagePicker.jsx';

export interface NotebookIconEditorProps {
	notebook: Notebook;
	className?: string;
}

export function NotebookIconEditor({
	notebook,
	className,
}: NotebookIconEditorProps) {
	const { icon } = hooks.useWatch(notebook);
	hooks.useWatch(icon);
	return (
		<Popover>
			<Popover.Trigger asChild>
				<Button
					color="ghost"
					className={clsx('p-0 overflow-hidden aspect-1', className)}
				>
					{icon?.url ?
						<img src={icon.url} className="w-full h-full object-cover" />
					:	<Box
							className="w-full h-full bg-gray color-gray-dark"
							layout="center center"
						>
							<Icon name="download" className="rotate-180" />
						</Box>
					}
				</Button>
			</Popover.Trigger>
			<Popover.Content className="p-0">
				<Popover.Arrow />
				<Tabs>
					<Tabs.List>
						<Tabs.Trigger value="emoji">Emoji</Tabs.Trigger>
						<Tabs.Trigger value="image">Image</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="emoji" className="overflow-hidden rounded-lg">
						<EmojiImagePicker
							onSelect={(image) => notebook.set('icon', image)}
						/>
					</Tabs.Content>
					<Tabs.Content value="image" className="overflow-hidden">
						<ImageUploader
							value={icon?.url ?? null}
							onChange={(image) => notebook.set('icon', image)}
							className="w-352px h-435px"
						/>
					</Tabs.Content>
				</Tabs>
			</Popover.Content>
		</Popover>
	);
}
