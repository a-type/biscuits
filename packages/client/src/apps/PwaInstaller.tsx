import { PWAInstallElement } from '@khmyznikov/pwa-install';
import { HTMLAttributes, Ref, useEffect, useRef } from 'react';
import { getDeferredPrompt, installState, triggerInstall } from '../install.js';
import { useAppInfo } from '../react.js';

let singleton: any;

export function PwaInstaller() {
	const app = useAppInfo();
	const ref = useRef<PWAInstallElement>(null);

	useEffect(() => {
		const pwaInstall: PWAInstallElement | null = ref.current;
		if (!pwaInstall) return;
		singleton = pwaInstall;
		pwaInstall.manifestUrl = '/manifest.webmanifest';
		pwaInstall.icon = app.iconPath;
		pwaInstall.name = app.name;
		pwaInstall.description = app.description;
		pwaInstall.installDescription = 'Install this app on your device';
		pwaInstall.externalPromptEvent = getDeferredPrompt();
		pwaInstall.manualChrome = true;
		pwaInstall.manualApple = true;
		pwaInstall.disableChrome = true;
	}, [app]);

	return <pwa-install ref={ref} />;
}
PwaInstaller.show = () => {
	if (singleton) singleton.showDialog();
	else if (installState.installReady) triggerInstall();
};

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
