import { Button, ButtonProps, Icon } from '@a-type/ui';
import '@khmyznikov/pwa-install';
import { PWAInstallElement } from '@khmyznikov/pwa-install';
import { HTMLAttributes, Ref, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { getDeferredPrompt, installState, triggerInstall } from '../install.js';
import { useAppInfo } from '../react.js';

export function InstallButton(props: ButtonProps) {
	const app = useAppInfo();
	const ref = useRef<PWAInstallElement>(null);
	const { installReady } = useSnapshot(installState);

	useEffect(() => {
		const pwaInstall: PWAInstallElement | null = ref.current;
		if (!pwaInstall) return;
		pwaInstall.manifestUrl = '/manifest.webmanifest';
		pwaInstall.icon = app.iconPath;
		pwaInstall.name = app.name;
		pwaInstall.description = app.description;
		pwaInstall.installDescription = 'Install this app on your device';
		pwaInstall.externalPromptEvent = getDeferredPrompt();
	}, [app]);

	const show = () => {
		if (ref.current?.showDialog) {
			ref.current?.showDialog();
		} else {
			triggerInstall();
		}
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
			<pwa-install ref={ref} />
		</>
	);
}
export default InstallButton;

declare module 'react/jsx-runtime' {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace JSX {
		interface IntrinsicElements {
			'pwa-install': HTMLAttributes<PWAInstallElement> & {
				ref: Ref<PWAInstallElement>;
			};
		}
	}
}
