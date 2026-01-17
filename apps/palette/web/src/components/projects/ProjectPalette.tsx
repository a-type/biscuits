import { hooks } from '@/hooks.js';
import { clsx, H3 } from '@a-type/ui';
import { Project } from '@palette.biscuits/verdant';
import { useColorSelection, useSort } from './hooks.js';
// @ts-ignore
import { basicsOnboarding } from '@/onboarding/basics.js';
import { OnboardingTooltip } from '@biscuits/client';
// @ts-ignore
import { Color } from '@dynamize/color-utilities';

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
		<div className={clsx('m-1 flex flex-col items-stretch', className)}>
			<OnboardingTooltip
				onboarding={basicsOnboarding}
				step="palette"
				content="Tap 'Save' on a color to add it to your palette"
			>
				<H3>Saved Colors</H3>
			</OnboardingTooltip>
			{!sorted.length && (
				<span className="m-auto text-xs italic color-gray-dark">
					Click the image to select colors
				</span>
			)}
			<div
				className={clsx(
					'grid grid-cols-6 content-start items-start justify-start gap-1',
					'md:grid-cols-4',
				)}
				onClick={() => {
					selectId(null);
				}}
			>
				{sorted.map((color, i) => (
					<button
						key={i}
						className={clsx(
							'[border-image:none] aspect-1 appearance-none rounded border-solid p-0',
							selectedId === color.id ? 'border-2 border-black' : 'border-0',
						)}
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
		</div>
	);
}
