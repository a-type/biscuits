import {
	Chip,
	CollapsibleContent,
	CollapsibleRoot,
	CollapsibleTrigger,
	Icon,
} from '@a-type/ui';
import { ResultOf, graphql } from '@biscuits/graphql';
import classNames from 'classnames';
import { TemperatureUnit } from './TemperatureUnit.jsx';
import { useTemperatureUnit } from './useTemperatureUnit.js';

export interface WeatherForecastProps {
	className?: string;
	forecast: ResultOf<typeof forecast>;
}

const forecastDay = graphql(`
	fragment ForecastDay on WeatherForecastDay @_unmask {
		date
		high
		low
		willRain
	}
`);

export const forecast = graphql(
	`
		fragment Forecast on WeatherForecast @_unmask {
			error
			high
			low
			willRain
			temperatureUnit
			days {
				...ForecastDay
			}
		}
	`,
	[forecastDay],
);

export function WeatherForecast({
	className,
	forecast: data,
}: WeatherForecastProps) {
	const { toDisplay } = useTemperatureUnit();
	return (
		<CollapsibleRoot className={classNames('w-full', className)}>
			<CollapsibleTrigger className="bg-transparent border-none flex flex-row items-center gap-1 flex-wrap p-2 w-full">
				<Chip aria-label="High temperature" className="color-black">
					<Icon name="arrowUp" className="text-attention-dark" />
					{toDisplay(data.high)}
					<TemperatureUnit />
				</Chip>
				<Chip aria-label="Low temperature" className="color-black">
					<Icon name="arrowDown" className="color-primary-dark" />
					{toDisplay(data.low)}
					<TemperatureUnit />
				</Chip>
				{data.willRain && (
					<Chip className="color-black">
						<Raindrop /> Rain
					</Chip>
				)}
				<Icon
					name="arrowDown"
					className="ml-auto [*[data-state=open]>&]:rotate-180 transition-transform color-black"
				/>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<span className="color-gray-dark italic text-xs pl-2 py-1">
					Daily Forecast
				</span>
				<div className="flex flex-row gap-1 overflow-x-auto w-full min-w-0 py-2">
					{data.days.map((day, i) => (
						<DayForecast day={day} key={i} />
					))}
				</div>
			</CollapsibleContent>
		</CollapsibleRoot>
	);
}

function DayForecast({ day }: { day: ResultOf<typeof forecastDay> }) {
	const { date, high, low, willRain } = day;
	const { toDisplay } = useTemperatureUnit();
	const dateNumber = date.split('-').pop();

	return (
		<div className="flex flex-col items-center gap-1 border border-1 border-solid border-black bg-white rounded-md text-xs py-1 px-4 relative">
			<div className="font-bold text-sm">{dateNumber}</div>
			{!!willRain && <Raindrop className="absolute top-1 right-1" />}
			<div className="flex flex-col items-center">
				<div
					className="text-attention-dark flex flex-row items-center"
					aria-label="High temperature"
				>
					<Icon name="arrowUp" />
					{toDisplay(high)}
				</div>
				<div
					className="color-primary-dark flex flex-row items-center"
					aria-label="Low temperature"
				>
					<Icon name="arrowDown" />
					{toDisplay(low)}
				</div>
			</div>
		</div>
	);
}

function Raindrop({ className }: { className?: string }) {
	return (
		<svg
			width="11"
			height="14"
			viewBox="0 0 11 14"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				d="M9.49985 9.99999C8.49988 14 2.49988 14 1.49985 9.99999C0.49983 5.99997 5.49975 1 5.49975 1C5.49975 1 10.4998 5.99997 9.49985 9.99999Z"
				strokeLinejoin="round"
				className="stroke-primary-dark fill-primary"
			/>
		</svg>
	);
}
