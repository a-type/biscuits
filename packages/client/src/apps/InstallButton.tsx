import { Button, ButtonProps, Icon } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { installState, triggerInstall } from '../install.js';

export function InstallButton(props: ButtonProps) {
	const { installReady } = useSnapshot(installState);

	if (!installReady) return null;

	return (
		<Button
			color="ghost"
			size="small"
			className="font-normal"
			onClick={triggerInstall}
			{...props}
		>
			{props.children || (
				<>
					<Icon name="arrowDown" />
					<span>Install app</span>
				</>
			)}
		</Button>
	);
}
