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
		<div className="flex flex-col gap-3 items-start bg-primary-wash color-black p-4 rounded-lg border border-solid border-primary w-full">
			<div>
				<Icon name="star" />
				&nbsp;App update available!
			</div>
			<Button
				loading={loading}
				color="primary"
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
