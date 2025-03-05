import { Button, ButtonProps, Dialog, H3, Icon, P } from '@a-type/ui';
import { DomainRouteView } from '@biscuits/client';
import { Notebook } from '@post.biscuits/verdant';

export interface NotebookPublishControlProps extends ButtonProps {
	notebook: Notebook;
}

export function NotebookPublishControl({
	notebook,
	...props
}: NotebookPublishControlProps) {
	return (
		<Dialog>
			<Dialog.Trigger asChild>
				<Button color="accent" {...props}>
					<Icon name="gear" /> Publishing
				</Button>
			</Dialog.Trigger>
			<Dialog.Content className="flex flex-col gap-md">
				<Dialog.Title>Notebook Publishing Settings</Dialog.Title>
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
