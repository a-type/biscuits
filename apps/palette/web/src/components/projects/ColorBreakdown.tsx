import { basicsOnboarding } from '@/onboarding/basics.js';
import { Box, clsx, useBoundsCssVars } from '@a-type/ui';
import { OnboardingTooltip } from '@biscuits/client';
// @ts-ignore
import { Color } from '@dynamize/color-utilities';
import cls from './ColorBreakdown.module.css';

export interface ColorBreakdownProps {
	color: { r: number; g: number; b: number };
	className?: string;
}

const yellow = 'rgb(255,255,0)';
const red = 'rgb(255,0,0)';
const blue = 'rgb(0,0,255)';

// shows r/y/b distribution of a color
export function ColorBreakdown({ color, className }: ColorBreakdownProps) {
	const { r, g, b } = color;
	const convertible = new Color('rgb', { red: r, green: g, blue: b }, [
		'ryb',
		'cmyk',
		'hsl',
	]);
	const ryb = convertible.ryb;
	const rybTotal = ryb.red + ryb.yellow + ryb.blue;
	const hsl = convertible.hsl;

	return (
		<OnboardingTooltip
			onboarding={basicsOnboarding}
			step="color"
			content="This section shows the selected color and mixing helpers."
		>
			<Box justify="around" gap className={className}>
				<PieChart
					segments={[
						{
							label: 'R',
							color: red,
							percent: (100 * ryb.red) / rybTotal,
						},
						{
							label: 'Y',
							color: yellow,
							percent: (100 * ryb.yellow) / rybTotal,
						},
						{
							label: 'B',
							color: blue,
							percent: (100 * ryb.blue) / rybTotal,
						},
					]}
				/>
				<Box full="height" className={cls.lightnessRange}>
					<Box
						className={cls.lightnessIndicator}
						style={{
							top: `${hsl.lightness}%`,
							background: hsl.lightness > 50 ? 'black' : 'white',
						}}
					/>
				</Box>
			</Box>
		</OnboardingTooltip>
	);
}

function PieChart({
	segments,
	className,
}: {
	segments: { color: string; percent: number; label: string }[];
	className?: string;
}) {
	let total = 0;
	const gradient = `conic-gradient(${segments
		.map(({ color, percent }, i) => {
			const steps = [];
			if (i > 0) {
				steps.push(`${color} ${total}%`);
			}
			total += percent;
			steps.push(`${color} ${total}%`);
			return steps;
		})
		.flat()
		.join(', ')})`;

	let totalAngle = 0;
	const segmentLabelRadians = segments.map(({ percent }) => {
		const angle = (percent / 100) * Math.PI * 2;
		const angleCenter = totalAngle + angle / 2 - Math.PI / 2;
		// eslint-disable-next-line react-hooks/immutability
		totalAngle += angle;
		return angleCenter;
	});

	const rootRef = useBoundsCssVars<HTMLDivElement>();

	return (
		<div
			ref={rootRef}
			style={{
				backgroundImage: gradient,
			}}
			className={clsx(cls.pieRoot, className)}
		>
			<div className={cls.pieInner}>
				{/* Render percentage values in the correct positions */}
				{segments.map(({ label, percent }, i) => {
					const x = Math.cos(segmentLabelRadians[i]);
					const y = Math.sin(segmentLabelRadians[i]);

					return (
						<span
							key={label}
							className={cls.pieLabel}
							style={{
								transform: `translate(-50%, -50%) translate(calc(var(--height) * 0.33 * ${x}), calc(var(--height) * 0.33 * ${y}))`,
							}}
						>
							{label}&nbsp;{percent.toFixed(0)}%
						</span>
					);
				})}
			</div>
		</div>
	);
}
