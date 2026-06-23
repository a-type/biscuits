import { Box, Button, Icon } from '@a-type/ui';
import { useState } from 'react';
import { updateApp, useIsUpdateAvailable } from './updateState.js';

export interface UpdatePromptProps {
	className?: string;
}

const TEST = false;

export function UpdatePrompt({ className }: UpdatePromptProps) {
	const updateAvailable = useIsUpdateAvailable();

	const [loading, setLoading] = useState(false);

	if (!updateAvailable && !TEST) {
		return null;
	}

	return (
		<Box
			full="width"
			surface="primary"
			gap
			col
			items="start"
			rounded
			p
			className={className}
		>
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
		</Box>
	);
}
