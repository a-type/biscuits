import { Button, Dialog, DialogProps } from '@a-type/ui';
import { Link } from '@verdant-web/react-router';
import { useContext, useEffect, useState } from 'react';
import { CONFIG, VerdantContext } from '../index.js';
import { useLocalStorage } from '../react.js';

export interface DeveloperErrorDialogProps extends DialogProps {}

export function DeveloperErrorDialog(props: DeveloperErrorDialogProps) {
	const verdant = useContext(VerdantContext);
	const [error, setError] = useState<null | Error>(null);
	useEffect(() => {
		let unsub: (() => void) | undefined;
		verdant?.open().then((client) => {
			unsub = client.subscribe('developerError', setError);
		});
		return () => {
			unsub?.();
		};
	}, [verdant]);
	const [lastReloadTime, setLastReloadTime] = useLocalStorage(
		'developerError-lastReload',
		0,
		false,
	);
	const justReloaded = Date.now() - lastReloadTime < 2000;

	const reload = () => {
		setLastReloadTime(Date.now());
		window.location.reload();
	};

	return (
		<Dialog {...props} open={!!error}>
			<Dialog.Content>
				<Dialog.Title>Data error</Dialog.Title>
				<Dialog.Description>
					Sorry to interrupt, but it seems something is fishy with this app's
					data.{' '}
					{justReloaded ?
						"Seems reloading didn't fix it. To avoid data loss, please contact support."
					:	"Let's try reloading the app."}
				</Dialog.Description>
				{justReloaded ?
					<Dialog.Actions>
						<Button onClick={reload}>Reload again</Button>
						<Button asChild>
							<Link to={`${CONFIG.HOME_ORIGIN}/contact`} newTab>
								Contact support
							</Link>
						</Button>
					</Dialog.Actions>
				:	<Dialog.Actions>
						<Button color="primary" onClick={reload}>
							Reload
						</Button>
					</Dialog.Actions>
				}
			</Dialog.Content>
		</Dialog>
	);
}
