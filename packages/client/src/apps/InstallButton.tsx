import { Button, ButtonProps, Icon } from '@a-type/ui';
import '@khmyznikov/pwa-install';
import { useSnapshot } from 'valtio';
import { installState } from '../install.js';
import { PwaInstaller } from './PwaInstaller.jsx';

export function InstallButton(props: ButtonProps) {
	const { installReady } = useSnapshot(installState);

	const show = () => {
		PwaInstaller.show();
	};

	if (!installReady) return null;

	return (
		<>
			<Button color="ghost" size="small" onClick={show} {...props}>
				{props.children || (
					<>
						<Icon name="arrowDown" />
						<span>Install app</span>
					</>
				)}
			</Button>
		</>
	);
}
export default InstallButton;
