import { Button, Icon } from '@a-type/ui';
import { useState } from 'react';
import { updateApp, useIsUpdateAvailable } from './updateState.js';

export interface UpdatePromptProps {}

const TEST = false;

export function UpdatePrompt({}: UpdatePromptProps) {
	const updateAvailable = useIsUpdateAvailable();

	const [loading, setLoading] = useState(false);

	if (!updateAvailable && !TEST) {
		return null;
	}

	return (
		<div className="w-full flex flex-col items-start gap-3 border rounded-lg border-solid p-4 color-black bg-primary-wash border-primary">
			<div>
				<Icon name="star" />
				&nbsp;App update available!
			</div>
			<Button
				loading={loading}
				emphasis="primary"
				onClick={async () => {
					try {
						setLoading(true);
						await updateApp(true);
					} finally {
						setLoading(false);
					}
				}}
			>
				Get the latest
			</Button>
		</div>
	);
}
