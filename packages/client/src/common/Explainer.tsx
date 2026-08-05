import { Box, Button, Dialog } from '@a-type/ui';
import { ReactNode, useState } from 'react';
import { useLocalStorage } from '../hooks/useStorage.js';

export interface ExplainerProps {
	stages: ReactNode[];
}

export function Explainer({ stages }: ExplainerProps) {
	const [explainerDismissed, setExplainerDismissed] = useLocalStorage(
		'explainerDismissed',
		false,
	);
	const [stage, setStage] = useState(0);
	return (
		<Dialog
			open={!explainerDismissed}
			onOpenChange={(open) => {
				if (!open) {
					setExplainerDismissed(true);
				}
			}}
		>
			<Dialog.Content>
				<Box grow items="start" gap col>
					{stages[stage]}
				</Box>
				<Dialog.Actions>
					<Dialog.Close render={<Button />}>Skip</Dialog.Close>
					<Button
						style={{ marginLeft: 'auto' }}
						emphasis="primary"
						onClick={() => {
							if (stage === stages.length - 1) {
								setExplainerDismissed(true);
							} else {
								setStage(stage + 1);
							}
						}}
					>
						{stage === stages.length - 1 ? 'Got it!' : 'Next'}
					</Button>
				</Dialog.Actions>
			</Dialog.Content>
		</Dialog>
	);
}
