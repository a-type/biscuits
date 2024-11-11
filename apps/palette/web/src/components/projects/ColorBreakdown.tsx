import { hooks } from '@/hooks.js';
import { Project, ProjectColorsItem } from '@palette.biscuits/verdant';
// @ts-ignore
import { Color } from '@dynamize/color-utilities';
import { useColorSelection } from './hooks.js';
import { clsx } from '@a-type/ui';
import { useBoundsCssVars } from '@a-type/ui/hooks';

export interface ColorBreakdownProps {
	project: Project;
	className?: string;
}

// shows r/y/b distribution of a color
export function ColorBreakdown({ project, className }: ColorBreakdownProps) {
	const [selectedId] = useColorSelection();
	const { colors } = hooks.useWatch(project);
	hooks.useWatch(colors);
	const matchingColor = colors.find((c) => c.get('id') === selectedId);

	if (!matchingColor) {
		return null;
	}

	return <ColorBreakdownVisuals color={matchingColor} className={className} />;
}

const yellow = 'rgb(255,255,0)';
const red = 'rgb(255,0,0)';
const blue = 'rgb(0,0,255)';
const cyan = 'rgb(0,255,255)';
const magenta = 'rgb(255,0,255)';
const black = 'rgb(0,0,0)';

function ColorBreakdownVisuals({
	color,
	className,
}: {
	color: ProjectColorsItem;
	className?: string;
}) {
	const { value } = hooks.useWatch(color);
	const { r, g, b } = value.getSnapshot();
	const convertible = new Color('rgb', { red: r, green: g, blue: b }, [
		'ryb',
		'cmyk',
		'hsl',
	]);
	const ryb = convertible.ryb;
	const rybTotal = ryb.red + ryb.yellow + ryb.blue;
	const cmyk = convertible.cmyk;
	const cmykTotal = cmyk.cyan + cmyk.magenta + cmyk.yellow;
	const hsl = convertible.hsl;

	return (
		<div className="flex flex-col gap-3">
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
			<div className="w-100% h-32px flex-shrink-0 bg-gradient-to-r from-#000000 to-#ffffff relative mt-3">
				<div
					className="h-full w-5px absolute"
					style={{
						left: `${hsl.lightness}%`,
						background: hsl.lightness > 50 ? 'black' : 'white',
					}}
				/>
			</div>
		</div>
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
			className={clsx('rounded-full aspect-1 w-full relative', className)}
		>
			<div className="left-1/2 top-1/2 absolute overflow-visible">
				{/* Render percentage values in the correct positions */}
				{segments.map(({ label, percent }, i) => {
					const x = Math.cos(segmentLabelRadians[i]);
					const y = Math.sin(segmentLabelRadians[i]);

					return (
						<span
							key={label}
							className="absolute rounded-full py-1 px-3 bg-white border-default"
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
