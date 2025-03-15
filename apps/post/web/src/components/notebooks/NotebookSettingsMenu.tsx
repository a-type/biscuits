import { Button, ButtonProps, Dialog, H3, Icon, P } from '@a-type/ui';
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
	return (
		<Dialog>
			<Dialog.Trigger asChild>
				<Button size="icon" {...rest}>
					{children || <Icon name="gear" />}
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Settings</Dialog.Title>
				<H3>Domain</H3>
				<P>You can assign a custom domain you own to this notebook.</P>
				<DomainRouteView resourceId={notebook.get('id')} />
				<Dialog.Actions>
					<Dialog.Close />
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
