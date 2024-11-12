import { Project } from '@palette.biscuits/verdant';
import { useColorSelection } from './hooks.js';
import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { useSnapshot } from 'valtio';
import { toolState } from './state.js';
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
					'm-1 relative flex flex-col md:flex-row gap-1',
					className,
				)}
			>
				<div
					className={'relative flex-1-0-0 h-full rounded-lg'}
					style={{
						backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
					}}
				>
					<div className="absolute right-3 bottom-3 row">
						{!!pickingColor && (
							<Button
								size="small"
								color="primary"
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
