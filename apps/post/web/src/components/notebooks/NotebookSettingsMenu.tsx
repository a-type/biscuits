import { hooks } from '@/hooks.js';
import {
	Box,
	Button,
	ButtonProps,
	ColorPicker,
	Dialog,
	H3,
	Icon,
	LiveUpdateTextField,
	P,
	ThemeName,
} from '@a-type/ui';
import { DomainRouteView } from '@biscuits/client';
import { Notebook } from '@post.biscuits/verdant';

export interface NotebookSettingsMenuProps extends ButtonProps {
	notebook: Notebook;
}

export function NotebookSettingsMenu({
	children,
	notebook,
	...rest
}: NotebookSettingsMenuProps) {
	const { theme, name, publishedTitle } = hooks.useWatch(notebook);
	return (
		<Dialog>
			<Dialog.Trigger asChild>
				<Button size="icon" {...rest}>
					{children || <Icon name="gear" />}
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Box d="col" gap>
					<Dialog.Title>Settings</Dialog.Title>
					<H3>Published title</H3>
					<P>
						Change the title that appears if you publish this notebook online.
					</P>
					<LiveUpdateTextField
						value={publishedTitle || name}
						onChange={(v) => notebook.set('publishedTitle', v)}
					/>
					<H3>Styling</H3>
					<P>Customize the appearance of this notebook.</P>
					<ColorPicker
						onChange={(theme) => notebook.set('theme', theme)}
						value={(theme as ThemeName) || 'blueberry'}
					/>
					<H3>Domain</H3>
					<P>You can assign a custom domain you own to this notebook.</P>
					<DomainRouteView resourceId={notebook.get('id')} />
				</Box>
				<Dialog.Actions>
					<Dialog.Close />
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
