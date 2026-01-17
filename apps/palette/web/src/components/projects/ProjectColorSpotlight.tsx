import { hooks } from '@/hooks.js';
import { Button, clsx, Icon } from '@a-type/ui';
import { Project } from '@palette.biscuits/verdant';
import { useSnapshot } from 'valtio';
import { ColorBreakdown } from './ColorBreakdown.jsx';
import { useColorSelection } from './hooks.js';
import { toolState } from './state.js';

export interface ProjectColorSpotlightProps {
	project: Project;
	className?: string;
}

export function ProjectColorSpotlight({
	project,
	className,
}: ProjectColorSpotlightProps) {
	const [selectedId, setSelectedId] = useColorSelection();
	const { colors } = hooks.useWatch(project);
	const matchingColor = colors.find((c) => c.get('id') === selectedId);
	hooks.useWatch(matchingColor || null);
	const matchingColorValues = matchingColor?.get('value')?.getSnapshot();

	const { pickedColor: pickingColor } = useSnapshot(toolState);

	const color = pickingColor?.value || matchingColorValues;

	if (color) {
		return (
			<div
				className={clsx(
					'relative m-1 flex flex-col gap-1 md:flex-row',
					className,
				)}
			>
				<div
					className={'relative h-full flex-1-0-0 rounded-lg'}
					style={{
						backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
					}}
				>
					<div className="absolute bottom-3 right-3 row">
						{!!pickingColor && (
							<Button
								size="small"
								emphasis="primary"
								onClick={() => {
									colors.push(pickingColor);
									const color = colors.get(colors.length - 1);
									toolState.pickedColor = null;
									setSelectedId(color.get('id'));
								}}
							>
								<Icon name="plus" /> Save
							</Button>
						)}
					</div>
				</div>
				<ColorBreakdown color={color} className="flex-1-0-0 p-2" />
			</div>
		);
	}

	return (
		<div
			className={clsx(
				'border-gray-4 flex flex-col items-center justify-center border-1 rounded-lg border-solid p-2',
				className,
			)}
		>
			<span className="text-xs italic color-gray-dark">
				Select a color to see it here
			</span>
		</div>
	);
}
