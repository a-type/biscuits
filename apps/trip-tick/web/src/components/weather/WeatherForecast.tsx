import { hooks } from '@/store.js';
import { Icon } from '@a-type/ui/components/icon';
import {
  FragmentOf,
  graphql,
  readFragment,
  useCanSync,
  useSuspenseQuery,
} from '@biscuits/client';
import { Trip } from '@trip-tick.biscuits/verdant';
import { Suspense } from 'react';
import { Chip } from '@a-type/ui/components/chip';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@a-type/ui/components/collapsible';
import classNames from 'classnames';

export interface WeatherForecastProps {
  className?: string;
  trip: Trip;
}

const forecastDay = graphql(`
  fragment ForecastDay on WeatherForecastDay {
    date
    high
    low
    willRain
  }
`);

const forecast = graphql(
  `
    query WeatherForecast($input: WeatherForecastInput!) {
      weatherForecast(input: $input) {
        error
        high
        low
        willRain
        temperatureUnit
        days {
          ...ForecastDay
        }
      }
    }
  `,
  [forecastDay],
);

export function WeatherForecast({ className, trip }: WeatherForecastProps) {
  const { location, startsAt, endsAt } = hooks.useWatch(trip);
  hooks.useWatch(location);
  const subscribed = useCanSync();

  if (!location || !startsAt || !endsAt || !subscribed) {
    return null;
  }

  return (
    <div className={classNames('w-full', className)}>
      <ErrorBoundary>
        <Suspense>
          <Forecast
            startsAt={startsAt}
            endsAt={endsAt}
            latitude={location.get('latitude')}
            longitude={location.get('longitude')}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function Forecast({
  startsAt,
  endsAt,
  latitude,
  longitude,
}: {
  startsAt: number;
  endsAt: number;
  latitude: number;
  longitude: number;
}) {
  const { data } = useSuspenseQuery(forecast, {
    variables: {
      input: {
        startDate: new Date(startsAt).toISOString(),
        endDate: new Date(endsAt).toISOString(),
        latitude,
        longitude,
        temperatureUnits: 'Fahrenheit',
      },
    },
    fetchPolicy: 'cache-first',
  });

  return (
    <CollapsibleRoot>
      <CollapsibleTrigger className="bg-transparent border-none flex flex-row items-center gap-1 flex-wrap p-2 w-full">
        <Chip aria-label="High temperature" className="text-black">
          <Icon name="arrowUp" className="text-attention-dark" />
          <span>
            {Math.round(data.weatherForecast.high)}
            <TempUnit unit={data.weatherForecast.temperatureUnit} />
          </span>
        </Chip>
        <Chip aria-label="Low temperature" className="text-black">
          <Icon name="arrowDown" className="text-primary-dark" />
          {Math.round(data.weatherForecast.low)}
          <TempUnit unit={data.weatherForecast.temperatureUnit} />
        </Chip>
        {data.weatherForecast.willRain && (
          <Chip className="text-black">
            <Raindrop /> Rain
          </Chip>
        )}
        <Icon
          name="arrowDown"
          className="ml-auto [*[data-state=open]>&]:rotate-180 transition-transform"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-row gap-1 overflow-x-auto w-full min-w-0 py-2">
          {data.weatherForecast.days.map((day, i) => (
            <DayForecast day={day} key={i} />
          ))}
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
}

function TempUnit({ unit }: { unit: 'Fahrenheit' | 'Celsius' }) {
  return <span>{unit === 'Fahrenheit' ? '°F' : '°C'}</span>;
}

function DayForecast({ day }: { day: FragmentOf<typeof forecastDay> }) {
  const { date, high, low, willRain } = readFragment(forecastDay, day);

  return (
    <div className="flex flex-col items-center gap-1 border border-1 border-solid border-black bg-white rounded-md text-xs py-1 px-4 relative">
      <div className="font-bold text-sm">{new Date(date).getDate()}</div>
      {willRain && <Raindrop className="absolute top-1 right-1" />}
      <div className="flex flex-col items-center">
        <div
          className="text-attention-dark flex flex-row items-center"
          aria-label="High temperature"
        >
          <Icon name="arrowUp" />
          {Math.round(high)}
        </div>
        <div
          className="text-primary-dark flex flex-row items-center"
          aria-label="Low temperature"
        >
          <Icon name="arrowDown" />
          {Math.round(low)}
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
