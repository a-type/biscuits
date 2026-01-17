import {
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
} from '@a-type/ui';
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
			<DialogContent
				outerClassName="h-screen max-h-90dvh sm:(h-auto max-h-[80dvh]) overflow-y-auto"
				className="h-full sm:h-auto"
			>
				<div className="col flex-1 items-start gap-4">{stages[stage]}</div>
				<DialogActions>
					<DialogClose render={<Button />}>Skip</DialogClose>
					<Button
						className="ml-auto"
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
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}
