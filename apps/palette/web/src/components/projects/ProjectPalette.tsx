import { hooks } from '@/hooks.js';
import { clsx } from '@a-type/ui';
import { Project } from '@palette.biscuits/verdant';
import { useColorSelection, useSort } from './hooks.js';
import { H3 } from '@a-type/ui/components/typography';
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
		<div className={clsx('flex flex-col items-stretch m-1', className)}>
			<H3>Saved Colors</H3>
			{!sorted.length && (
				<span className="text-xs text-gray-5 italic m-auto">
					Click the image to select colors
				</span>
			)}
			<div
				className={clsx(
					'grid grid-cols-6 gap-1 justify-start items-start content-start',
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
							'rounded appearance-none p-0 [border-image:none] border-solid aspect-1',
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

function rgbToHue(r: number, g: number, b: number) {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;
	let hue = 0;
	if (delta === 0) {
		hue = 0;
	} else if (max === r) {
		hue = ((g - b) / delta) % 6;
	} else if (max === g) {
		hue = (b - r) / delta + 2;
	} else {
		hue = (r - g) / delta + 4;
	}
	hue *= 60;
	if (hue < 0) {
		hue += 360;
	}
	return hue;
}
