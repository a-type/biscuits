import { hooks } from '@/hooks.js';
import { Project, ProjectColorsItem } from '@palette.biscuits/verdant';
// @ts-ignore
import { Color } from '@dynamize/color-utilities';
import { Tabs } from '@a-type/ui/components/tabs';
import { useColorSelection } from './hooks.js';
import { H3 } from '@a-type/ui/components/typography';
import { clsx } from '@a-type/ui';

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
		<Tabs className={clsx('flex flex-col gap-2', className)} defaultValue="ryb">
			<div className="row justify-between pl-3">
				<H3>Color mix</H3>
				<Tabs.List>
					<Tabs.Trigger value="ryb">RYB</Tabs.Trigger>
					<Tabs.Trigger value="cmy">CMY</Tabs.Trigger>
				</Tabs.List>
			</div>
			<Tabs.Content value="ryb">
				<PieChart
					segments={[
						{
							color: red,
							percent: (100 * ryb.red) / rybTotal,
						},
						{
							color: yellow,
							percent: (100 * ryb.yellow) / rybTotal,
						},
						{
							color: blue,
							percent: (100 * ryb.blue) / rybTotal,
						},
					]}
				/>
			</Tabs.Content>
			<Tabs.Content value="cmy">
				<PieChart
					segments={[
						{ color: cyan, percent: (100 * cmyk.cyan) / cmykTotal },
						{ color: magenta, percent: (100 * cmyk.magenta) / cmykTotal },
						{ color: yellow, percent: (100 * cmyk.yellow) / cmykTotal },
					]}
				/>
			</Tabs.Content>
			<div className="w-100% h-32px flex-shrink-0 bg-gradient-to-r from-#000000 to-#ffffff relative mt-3">
				<div
					className="h-full w-5px absolute"
					style={{
						left: `${hsl.lightness}%`,
						background: hsl.lightness > 50 ? 'black' : 'white',
					}}
				/>
			</div>
		</Tabs>
	);
}

function PieChart({
	segments,
	className,
}: {
	segments: { color: string; percent: number }[];
	className?: string;
}) {
	let total = 0;
	console.log(segments);
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
	console.log(gradient);
	return (
		<div
			style={{
				backgroundImage: gradient,
			}}
			className={clsx('rounded-full aspect-1 w-full', className)}
		/>
	);
}
