import { hooks } from '@/hooks.js';
import { basicsOnboarding } from '@/onboarding/basics.js';
import { Box, H3, Text } from '@a-type/ui';
import { OnboardingTooltip } from '@biscuits/client';
import { Project } from '@palette.biscuits/verdant';
import { useColorSelection, useSort } from './hooks.js';
// @ts-ignore
import { Color } from '@dynamize/color-utilities';
import cls from './ProjectPalette.module.css';

export interface ProjectPaletteProps {
	project: Project;
	className?: string;
}

export function ProjectPalette({ project, className }: ProjectPaletteProps) {
	const { colors } = hooks.useWatch(project);
	hooks.useWatch(colors, { deep: true });

	const [sort] = useSort();

	// sort by hue
	const sorted = colors.getSnapshot().sort((a, b) => {
		const aColor = new Color(
			'rgb',
			{ red: a.value.r, green: a.value.g, blue: a.value.b },
			['hsl'],
		);
		const bColor = new Color(
			'rgb',
			{ red: b.value.r, green: b.value.g, blue: b.value.b },
			['hsl'],
		);
		return aColor.hsl[sort] - bColor.hsl[sort];
	});

	const [selectedId, selectId] = useColorSelection();

	return (
		<Box col items="stretch" p="xs" className={className}>
			<OnboardingTooltip
				onboarding={basicsOnboarding}
				step="palette"
				content="Tap 'Save' on a color to add it to your palette"
			>
				<H3>Saved Colors</H3>
			</OnboardingTooltip>
			{!sorted.length && (
				<Text emphasis="ambient" italic dim style={{ margin: 'auto' }}>
					Click the image to select colors
				</Text>
			)}
			<div
				className={cls.grid}
				onClick={() => {
					selectId(null);
				}}
			>
				{sorted.map((color, i) => (
					<button
						key={i}
						className={cls.item}
						data-selected={selectedId === color.id}
						onClick={(ev) => {
							selectId(color.id);
							ev.stopPropagation();
						}}
						style={{
							backgroundColor: `rgb(${color.value.r}, ${color.value.g}, ${color.value.b})`,
						}}
					/>
				))}
			</div>
		</Box>
	);
}
