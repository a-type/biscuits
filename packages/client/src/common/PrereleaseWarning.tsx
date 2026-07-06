import { Box, Icon } from '@a-type/ui';
import { useAppInfo, useLocalStorage } from '../react.js';

export interface PrereleaseWarningProps {}

export function PrereleaseWarning({}: PrereleaseWarningProps) {
	const app = useAppInfo();
	const [dismissed, setDismissed] = useLocalStorage(
		'dismissedPrereleaseWarning',
		false,
	);

	if (!app.prerelease || dismissed || !import.meta.env.DEV) {
		return null;
	}

	return (
		<Box
			items="center"
			justify="center"
			color="attention"
			p="sm"
			className="@mode-denser"
		>
			<Icon name="warning" />
			<span>
				{app.name} is an unreleased{' '}
				<a
					target="_blank"
					rel="noreferrer"
					href="https://biscuits.club"
					style={{ textDecoration: 'underline' }}
				>
					Biscuits
				</a>{' '}
				app. It may be unstable or incomplete, and your data may be lost.
			</span>
			<Icon
				name="x"
				role="button"
				tabIndex={0}
				onClick={() => setDismissed(true)}
			/>
		</Box>
	);
}
