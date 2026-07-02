import { hooks } from '@/hooks.js';
import { Button, clsx, Icon, Text } from '@a-type/ui';
import { Project } from '@palette.biscuits/verdant';
import { useSnapshot } from 'valtio';
import { ColorBreakdown } from './ColorBreakdown.jsx';
import { useColorSelection } from './hooks.js';
import cls from './ProjectColorSpotlight.module.css';
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
			<div className={clsx(cls.root, className)}>
				<div
					className={cls.display}
					style={{
						backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
					}}
				>
					<div className={cls.controls}>
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
				<ColorBreakdown color={color} className={cls.breakdown} />
			</div>
		);
	}

	return (
		<div className={clsx(cls.empty, className)}>
			<Text italic dim emphasis="ambient">
				Select a color to see it here
			</Text>
		</div>
	);
}
