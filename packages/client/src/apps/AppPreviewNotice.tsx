import { Button, clsx, useIsInstallReady } from '@a-type/ui';
import { appsById, isValidAppId } from '@biscuits/apps';
import { Suspense, useEffect } from 'react';
import cls from './AppPreviewNotice.module.css';
import { InstallButton } from './InstallButton.js';

export interface AppPreviewNoticeProps {}

export function AppPreviewNotice({}: AppPreviewNoticeProps) {
	const searchParams = new URLSearchParams(window.location.search);
	const appPickerFrom = searchParams.get('appPickerFrom');

	const installReady = useIsInstallReady();

	useEffect(() => {
		// consume the param if present
		if (appPickerFrom) {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.delete('appPickerFrom');
			const url = new URL(window.location.href);
			url.search = searchParams.toString();
			window.history.replaceState(null, '', url.toString());
		}
	}, [appPickerFrom]);

	if (!appPickerFrom) return null;

	// if we can't install this as a PWA, there's not much point in showing this warning
	if (!installReady) {
		return null;
	}

	if (!isValidAppId(appPickerFrom)) return null;
	const fromApp = appsById[appPickerFrom];

	// this app is probably rendered inside a frame in the other app
	return (
		<div className={clsx('@mode-accent @mode-dense', cls.root)}>
			<p className={cls.content}>{`You're previewing this app.`}</p>
			<Button
				render={
					<a href={fromApp.url} target="_blank" rel="noopener noreferrer" />
				}
			>
				{`Back to ${fromApp.name}`}
			</Button>
			<Suspense>
				<InstallButton />
			</Suspense>
		</div>
	);
}
