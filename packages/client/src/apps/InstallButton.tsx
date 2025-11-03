import { Button, ButtonProps, Icon } from '@a-type/ui';
import '@khmyznikov/pwa-install';
import { useSnapshot } from 'valtio';
import { installState, triggerInstall } from '../install.js';
import { getIsFirefox, getIsSafari, getOS } from '../platform.js';
import { PwaInstaller } from './PwaInstaller.js';

export function InstallButton(props: ButtonProps) {
	const { installReady } = useSnapshot(installState);

	const onClick = () => {
		const os = getOS();
		if (getIsSafari() || getIsFirefox() || os === 'iOS' || os === 'Mac OS') {
			PwaInstaller.show();
		} else {
			triggerInstall();
		}
	};

	if (!installReady) return null;

	return (
		<>
			<Button emphasis="ghost" size="small" onClick={onClick} {...props}>
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
