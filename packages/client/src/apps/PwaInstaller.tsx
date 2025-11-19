import { type PWAInstallElement } from '@khmyznikov/pwa-install';
import { useEffect, useRef } from 'react';
import { getDeferredPrompt, installState, triggerInstall } from '../install.js';
import { useAppInfo, useMaybeAppId } from '../react.js';

let singleton: any;

if (typeof window !== 'undefined') {
	import('@khmyznikov/pwa-install');
}

export function PwaInstaller() {
	const maybeApp = useMaybeAppId();
	if (!maybeApp) return null;
	return <PwaInstallerInner />;
}

function PwaInstallerInner() {
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

	// @ts-ignore
	return <pwa-install ref={ref} />;
}
PwaInstaller.show = () => {
	if (singleton) singleton.showDialog();
	else if (installState.installReady) triggerInstall();
};
