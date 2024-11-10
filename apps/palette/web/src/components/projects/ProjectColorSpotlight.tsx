import { Project } from '@palette.biscuits/verdant';
import { useColorSelection } from './hooks.js';
import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { toolState } from './state.js';
import { assert } from '@a-type/utils';
import { Dialog } from '@a-type/ui/components/dialog';
import { useState } from 'react';
import { ColorBreakdown } from './ColorBreakdown.jsx';
import { Button } from '@a-type/ui/components/button';
import { Icon } from '@a-type/ui/components/icon';

export interface ProjectColorSpotlightProps {
	project: Project;
	className?: string;
}

export function ProjectColorSpotlight({
	project,
	className,
}: ProjectColorSpotlightProps) {
	const [selectedId] = useColorSelection();
	const { colors } = hooks.useWatch(project);
	const matchingColor = colors.find((c) => c.get('id') === selectedId);
	hooks.useWatch(matchingColor || null);
	const matchingColorValues = matchingColor?.get('value')?.getSnapshot();

	const { pickingColor } = useSnapshot(toolState);

	const showColor = !!pickingColor || !!matchingColorValues;

	const [showMixing, setShowMixing] = useState(false);

	if (!showColor) {
		return (
			<div
				className={clsx(
					'flex flex-col p-2 items-center justify-center border-1 border-solid border-gray-4 rounded-lg',
					className,
				)}
			>
				<span className="text-xs text-gray-5 italic">
					Select a color to see it here
				</span>
			</div>
		);
	}

	if (pickingColor) {
		return (
			<div
				className={clsx(
					'w-full h-full rounded-t-lg md:rounded-b-lg',
					className,
				)}
				style={{
					backgroundColor: pickingColor,
				}}
			/>
		);
	}

	assert(matchingColorValues);

	return (
		<div
			className={clsx(
				'w-full h-full rounded-t-lg relative md:rounded-b-lg',
				className,
			)}
			style={{
				backgroundColor: `rgb(${matchingColorValues.r}, ${matchingColorValues.g}, ${matchingColorValues.b})`,
			}}
		>
			<Dialog open={showMixing} onOpenChange={setShowMixing}>
				<Dialog.Trigger asChild>
					<Button className="absolute right-1 bottom-2" size="small">
						<Icon name="waterDrop" /> Mixing
					</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<ColorBreakdown project={project} />
					<Dialog.Actions>
						<Dialog.Close>Close</Dialog.Close>
					</Dialog.Actions>
				</Dialog.Content>
			</Dialog>
		</div>
	);
}
