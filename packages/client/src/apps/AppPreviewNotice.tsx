import { Button, useIsInstallReady } from '@a-type/ui';
import { appsById, isValidAppId } from '@biscuits/apps';
import { Suspense, useEffect } from 'react';
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
		<div className="w-full bg-accent-light p-2 flex flex-row gap-3 items-center">
			<p className="text-sm color-accent-dark flex-1">
				{`You're previewing this app.`}
			</p>
			<Button asChild>
				<a href={fromApp.url} target="_blank" rel="noopener noreferrer">
					{`Back to ${fromApp.name}`}
				</a>
			</Button>
			<Suspense>
				<InstallButton />
			</Suspense>
		</div>
	);
}
