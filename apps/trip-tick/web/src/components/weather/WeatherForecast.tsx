import { Box, Button, Chip, Collapsible, Icon, Text } from '@a-type/ui';
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
		<Collapsible className={classNames('w-full', className)}>
			<Collapsible.Trigger
				render={<Button size="wrapper" emphasis="ghost" full="width" />}
			>
				<Chip aria-label="High temperature">
					<Text color="main" className="@mode-attention">
						<Icon name="arrowUp" />
						{toDisplay(data.high)}
						<TemperatureUnit />
					</Text>
				</Chip>
				<Chip aria-label="Low temperature">
					<Text color="main" className="@mode-eggplant">
						<Icon name="arrowDown" className="color-primary-dark" />
						{toDisplay(data.low)}
						<TemperatureUnit />
					</Text>
				</Chip>
				{data.willRain && (
					<Chip>
						<Text color="main" className="@mode-blueberry">
							<Icon name="waterDrop" filled /> Rain
						</Text>
					</Chip>
				)}
				<Collapsible.Icon style={{ marginLeft: 'auto' }}>
					<Icon name="chevron" />
				</Collapsible.Icon>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<Text italic dim emphasis="ambient">
					Daily Forecast
				</Text>
				<Box gap="xs" overflow="auto-x" shrink>
					{data.days.map((day, i) => (
						<DayForecast day={day} key={i} />
					))}
				</Box>
			</Collapsible.Content>
		</Collapsible>
	);
}

function DayForecast({ day }: { day: ResultOf<typeof forecastDay> }) {
	const { date, high, low, willRain } = day;
	const { toDisplay } = useTemperatureUnit();
	const dateParts = date.split('-');
	const dateNumber = dateParts.pop();
	const monthNumber = dateParts.pop()?.replace(/^0/, '');

	return (
		<Box
			col
			items="center"
			gap="xs"
			surface="ambient"
			border
			p="sm"
			className="@mode-denser"
		>
			<Box gap="sm" style={{ minWidth: 48 }} layout="center">
				<Text emphasis="secondary" bold>
					{monthNumber}/{dateNumber}
				</Text>
				{!!willRain && (
					<Icon name="waterDrop" filled className="@mode-blueberry" />
				)}
			</Box>
			<Box col items="center">
				<Text
					color="main"
					className="@mode-attention"
					aria-label="High temperature"
					emphasis="ambient"
				>
					<Icon name="arrowUp" />
					{toDisplay(high)}
				</Text>
				<Text
					color="main"
					className="@mode-eggplant"
					aria-label="Low temperature"
					emphasis="ambient"
				>
					<Icon name="arrowDown" />
					{toDisplay(low)}
				</Text>
			</Box>
		</Box>
	);
}
