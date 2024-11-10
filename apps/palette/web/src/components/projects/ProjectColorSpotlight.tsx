import { Project } from '@palette.biscuits/verdant';
import { useColorSelection } from './hooks.js';
import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { toolState } from './state.js';

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

	const value =
		pickingColor ? pickingColor : (
			`rgb(${matchingColorValues!.r}, ${matchingColorValues!.g}, ${matchingColorValues!.b})`
		);

	return (
		<div
			className={clsx('w-full h-full rounded-lg', className)}
			style={{
				backgroundColor: value,
			}}
		/>
	);
}
